import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchFlight, fetchFlights } from './src/flights.ts'

const flight = {
  flight_number: 'CM204',
  airline: 'Copa Airlines',
  origin: 'PTY',
  destination: 'MIA',
  status: 'scheduled',
  scheduled_time: '2026-10-24T16:30:00',
  delay_minutes: 0,
}

test('flight list requests and validates the public API response', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch')
  mock.mock.mockImplementation(async (url, options) => {
    assert.equal(url, '/flights/')
    assert.equal(options.headers.Accept, 'application/json')
    return Response.json([flight])
  })
  assert.deepEqual(await fetchFlights(), [flight])

  mock.mock.mockImplementation(async () => Response.json({ flight_number: 'CM204' }))
  await assert.rejects(fetchFlights(), /respuesta inesperada/)
  mock.mock.mockImplementation(async () => new Response(null, { status: 503 }))
  await assert.rejects(fetchFlights(), /no está disponible/)
  mock.mock.mockImplementation(async () => { throw new TypeError('Failed to fetch') })
  await assert.rejects(fetchFlights(), /conectar/)
})

test('flight detail fetch encodes the number and validates every API field', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch')
  mock.mock.mockImplementation(async (url) => {
    assert.equal(url, '/flights/CM%20204')
    return Response.json({ ...flight, flight_number: 'CM 204' })
  })
  assert.deepEqual(await fetchFlight(' CM 204 '), { ...flight, flight_number: 'CM 204' })

  mock.mock.mockImplementation(async () => Response.json({ detail: 'Flight not found' }, { status: 404 }))
  assert.equal(await fetchFlight('CM204'), null)
  mock.mock.mockImplementation(async () => new Response(null, { status: 404 }))
  await assert.rejects(fetchFlight('CM204'), /no está disponible/)
  mock.mock.mockImplementation(async () => new Response(null, { status: 500 }))
  await assert.rejects(fetchFlight('CM204'), /no está disponible/)
  mock.mock.mockImplementation(async () => Response.json({ ...flight, flight_number: 'CM205' }))
  await assert.rejects(fetchFlight('CM204'), /respuesta inesperada/)
  mock.mock.mockImplementation(async () => Response.json({ ...flight, status: 'in-flight' }))
  await assert.rejects(fetchFlight('CM204'), /respuesta inesperada/)
})
