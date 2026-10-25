import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { fetchFlight, fetchFlights, type Flight, type FlightStatus } from './flights'
import './styles.css'

const statusLabels: Record<FlightStatus, string> = {
  scheduled: 'Programado',
  departed: 'Despegó',
  arrived: 'Llegó',
  cancelled: 'Cancelado',
  delayed: 'Demorado',
  boarding: 'Abordando',
}

const statusOptions: Array<[FlightStatus | 'all', string]> = [
  ['all', 'Todos los estados'],
  ['scheduled', 'Programado'],
  ['boarding', 'Abordando'],
  ['departed', 'Despegó'],
  ['arrived', 'Llegó'],
  ['delayed', 'Demorado'],
  ['cancelled', 'Cancelado'],
]

type Page = { view: 'board' } | { view: 'detail'; flightNumber: string } | { view: 'missing' }

function readPage(): Page {
  if (window.location.pathname === '/') return { view: 'board' }
  if (window.location.pathname === '/flight') {
    const flightNumber = new URLSearchParams(window.location.search).get('number')
    return flightNumber ? { view: 'detail', flightNumber } : { view: 'missing' }
  }
  return { view: 'missing' }
}

function getFilters() {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status') as FlightStatus | null
  return {
    query: params.get('q') ?? '',
    status: status && statusOptions.some(([value]) => value === status) ? status : 'all' as const,
  }
}

function formatStatus(status: FlightStatus) {
  return statusLabels[status]
}

function FlightRow({ flight, returnQuery, returnStatus }: {
  flight: Flight
  returnQuery: string
  returnStatus: FlightStatus | 'all'
}) {
  const detailUrl = new URLSearchParams({ number: flight.flight_number })
  if (returnQuery) detailUrl.set('q', returnQuery)
  if (returnStatus !== 'all') detailUrl.set('status', returnStatus)

  return (
    <article className="flight-row">
      <div className="flight-identity">
        <a className="flight-number" href={`/flight?${detailUrl.toString()}`}>
          {flight.flight_number}
          <span className="sr-only"> — ver detalle</span>
        </a>
        <span className="airline-name">{flight.airline}</span>
      </div>
      <div className="flight-route" aria-label={`De ${flight.origin} a ${flight.destination}`}>
        <span className="airport-code">{flight.origin}</span>
        <span className="route-rule" aria-hidden="true" />
        <span className="airport-code">{flight.destination}</span>
      </div>
      <div className="flight-schedule">
        <span className="row-label">Hora programada</span>
        <time>{flight.scheduled_time}</time>
      </div>
      <div className="flight-status-cell">
        <span className={`status-mark status-${flight.status}`} aria-hidden="true" />
        <span>{formatStatus(flight.status)}</span>
      </div>
    </article>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(readPage)
  const [filters, setFilters] = useState(getFilters)
  const [flights, setFlights] = useState<Flight[]>([])
  const [boardState, setBoardState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [boardError, setBoardError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [detail, setDetail] = useState<Flight | null>(null)
  const [detailState, setDetailState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')

  useEffect(() => {
    let current = true
    fetchFlights().then((items) => {
      if (!current) return
      setFlights(items)
      setBoardState('ready')
    }).catch((error: unknown) => {
      if (!current) return
      setBoardError(error instanceof Error ? error.message : 'No se pudo consultar la lista de vuelos.')
      setBoardState('error')
    })
    return () => { current = false }
  }, [reloadCount])

  useEffect(() => {
    function handlePopState() {
      setPage(readPage())
      setFilters(getFilters())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (page.view !== 'detail') return
    let current = true
    setDetail(null)
    setDetailState('loading')
    fetchFlight(page.flightNumber).then((flight) => {
      if (!current) return
      setDetail(flight)
      setDetailState(flight ? 'ready' : 'missing')
    }).catch(() => {
      if (current) setDetailState('error')
    })
    return () => { current = false }
  }, [page])

  function openBoard() {
    const params = new URLSearchParams()
    if (filters.query) params.set('q', filters.query)
    if (filters.status !== 'all') params.set('status', filters.status)
    const search = params.size ? `?${params.toString()}` : ''
    window.history.pushState(null, '', `/${search}`)
    setPage({ view: 'board' })
  }

  function retryBoard() {
    setBoardError('')
    setBoardState('loading')
    setFlights([])
    setReloadCount((count) => count + 1)
  }

  function updateFilters(next: typeof filters) {
    setFilters(next)
    const params = new URLSearchParams()
    if (next.query) params.set('q', next.query)
    if (next.status !== 'all') params.set('status', next.status)
    window.history.replaceState(null, '', `/${params.size ? `?${params.toString()}` : ''}`)
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  const normalizedQuery = filters.query.trim().toLocaleLowerCase()
  const visibleFlights = flights.filter((flight) => {
    const matchesQuery = !normalizedQuery || [flight.flight_number, flight.airline, flight.origin, flight.destination]
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
    return matchesQuery && (filters.status === 'all' || flight.status === filters.status)
  })

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); openBoard() }} aria-label="Flight PTY, tablero de vuelos">
          <span className="brand-mark" aria-hidden="true">PTY</span>
          <span>Flight PTY</span>
        </a>
        <span className="header-context">Consulta de vuelos</span>
      </header>

      <main id="main-content" className="main-content">
        {page.view === 'board' ? (
          <>
            <section className="board-heading" aria-labelledby="board-title">
              <div>
                <p className="section-kicker">Aeropuerto Internacional de Tocumen</p>
                <h1 id="board-title">Vuelos</h1>
              </div>
              {boardState === 'ready' && <p className="record-count">{flights.length} {flights.length === 1 ? 'vuelo registrado' : 'vuelos registrados'}</p>}
            </section>

            <section className="flight-board" aria-label="Consulta de vuelos">
              <form className="filter-bar" onSubmit={submitSearch} role="search">
                <label className="search-field">
                  <span className="sr-only">Buscar vuelo, aerolínea o aeropuerto</span>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
                  <input type="search" value={filters.query} onChange={(event) => updateFilters({ ...filters, query: event.target.value })}
                    placeholder="Vuelo, aerolínea o aeropuerto" />
                </label>
                <label className="status-filter">
                  <span className="sr-only">Filtrar por estado</span>
                  <select value={filters.status} onChange={(event) => updateFilters({ ...filters, status: event.target.value as FlightStatus | 'all' })}>
                    {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </form>

              {boardState === 'loading' && <p className="state-message" role="status">Cargando vuelos…</p>}
              {boardState === 'error' && (
                <div className="state-message state-error" role="alert">
                  <p>{boardError}</p><button className="text-button" onClick={retryBoard}>Intentar de nuevo</button>
                </div>
              )}
              {boardState === 'ready' && flights.length === 0 && (
                <p className="state-message">No hay vuelos registrados para consultar.</p>
              )}
              {boardState === 'ready' && flights.length > 0 && visibleFlights.length === 0 && (
                <div className="state-message">
                  <p>No hay vuelos que coincidan con la búsqueda y el estado elegidos.</p>
                  <button className="text-button" onClick={() => updateFilters({ query: '', status: 'all' })}>Limpiar búsqueda y filtro</button>
                </div>
              )}
              {boardState === 'ready' && visibleFlights.length > 0 && (
                <>
                  <div className="column-headings" aria-hidden="true">
                    <span>Vuelo / aerolínea</span><span>Ruta</span><span>Horario</span><span>Estado</span>
                  </div>
                  <div className="flight-list" aria-label={`${visibleFlights.length} vuelos encontrados`}>
                    {visibleFlights.map((flight) => <FlightRow key={flight.flight_number} flight={flight} returnQuery={filters.query} returnStatus={filters.status} />)}
                  </div>
                </>
              )}
            </section>
          </>
        ) : page.view === 'detail' ? (
          <section className="detail-view" aria-labelledby="detail-title">
            <button className="back-button" onClick={openBoard}>← Volver a vuelos</button>
            {detailState === 'loading' && <p className="state-message" role="status">Consultando el vuelo…</p>}
            {detailState === 'error' && <div className="state-message state-error" role="alert">
              <p>No se pudo consultar este vuelo. Revise su conexión e intente de nuevo.</p>
              <button className="text-button" onClick={() => setPage({ ...page })}>Intentar de nuevo</button>
            </div>}
            {detailState === 'missing' && <div className="state-message">
              <h1 id="detail-title">Vuelo no encontrado</h1><p>El vuelo {page.flightNumber} ya no aparece en los registros consultados.</p>
              <button className="text-button" onClick={openBoard}>Volver al tablero</button>
            </div>}
            {detailState === 'ready' && detail && <>
              <header className="detail-heading">
                <div><p className="section-kicker">Detalle del vuelo</p><h1 id="detail-title">{detail.flight_number}</h1><p>{detail.airline}</p></div>
                <p className={`detail-status status-text-${detail.status}`}><span className={`status-mark status-${detail.status}`} aria-hidden="true" />{formatStatus(detail.status)}</p>
              </header>
              <div className="detail-route" aria-label={`Ruta de ${detail.origin} a ${detail.destination}`}>
                <div><span className="row-label">Origen</span><strong className="airport-code">{detail.origin}</strong></div>
                <span className="route-rule" aria-hidden="true" />
                <div><span className="row-label">Destino</span><strong className="airport-code">{detail.destination}</strong></div>
              </div>
              <dl className="detail-facts">
                <div><dt>Hora programada</dt><dd>{detail.scheduled_time}</dd></div>
                <div><dt>Demora</dt><dd>{detail.delay_minutes === 0 ? 'Sin demora registrada' : `${detail.delay_minutes} min`}</dd></div>
              </dl>
            </>}
          </section>
        ) : (
          <section className="state-message"><h1>Página no encontrada</h1><p>Esta dirección no corresponde a una consulta de vuelos.</p>
            <button className="text-button" onClick={openBoard}>Ir al tablero</button></section>
        )}
      </main>
      <footer><span>Flight PTY</span><span>Información basada en los registros disponibles.</span></footer>
    </div>
  )
}
