export const flightStatuses = ['scheduled', 'departed', 'arrived', 'cancelled', 'delayed', 'boarding'] as const
export type FlightStatus = typeof flightStatuses[number]

export interface Flight {
  flight_number: string
  airline: string
  origin: string
  destination: string
  status: FlightStatus
  scheduled_time: string
  delay_minutes: number
}

const isFlight = (value: unknown): value is Flight => {
  if (!value || typeof value !== 'object') return false
  const flight = value as Record<string, unknown>
  return typeof flight.flight_number === 'string' && flight.flight_number.length > 0 &&
    typeof flight.airline === 'string' && typeof flight.origin === 'string' &&
    typeof flight.destination === 'string' && typeof flight.scheduled_time === 'string' &&
    typeof flight.delay_minutes === 'number' && Number.isInteger(flight.delay_minutes) && flight.delay_minutes >= 0 &&
    flightStatuses.some((status) => status === flight.status)
}

async function request(path: string): Promise<Response> {
  try {
    return await fetch(path, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) })
  } catch {
    throw new Error('No pudimos conectar con el servicio de vuelos. Intente nuevamente.')
  }
}

async function responseError(response: Response): Promise<Error> {
  if (response.status === 404) {
    const body: unknown = await response.json().catch(() => null)
    if (body && typeof body === 'object' && 'detail' in body && body.detail === 'Flight not found') {
      return new Error('Vuelo no encontrado.')
    }
  }
  if (!response.ok) return new Error('El servicio de vuelos no está disponible. Intente nuevamente.')
  return new Error('El servicio devolvió una respuesta inesperada. Intente nuevamente.')
}

export async function fetchFlights(): Promise<Flight[]> {
  const response = await request('/flights/')
  if (!response.ok) throw await responseError(response)
  const body: unknown = await response.json().catch(() => null)
  if (!Array.isArray(body) || !body.every(isFlight)) throw new Error('El servicio devolvió una respuesta inesperada. Intente nuevamente.')
  return body
}

export async function fetchFlight(flightNumber: string): Promise<Flight | null> {
  const number = flightNumber.trim()
  const response = await request(`/flights/${encodeURIComponent(number)}`)
  if (response.status === 404) {
    const body: unknown = await response.json().catch(() => null)
    if (body && typeof body === 'object' && 'detail' in body && body.detail === 'Flight not found') return null
    throw new Error('El servicio de vuelos no está disponible. Intente nuevamente.')
  }
  if (!response.ok) throw await responseError(response)
  const body: unknown = await response.json().catch(() => null)
  if (!isFlight(body) || body.flight_number !== number) throw new Error('El servicio devolvió una respuesta inesperada. Intente nuevamente.')
  return body
}
