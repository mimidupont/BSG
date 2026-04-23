'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [player, setPlayer] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadPlayer() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      setError('Failed to load player')
    } else {
      setPlayer(data)
    }
    setLoading(false)
  }

  async function produce() {
    const res = await fetch('/api/produce', { method: 'POST' })
    const json = await res.json()
    if (json.error) {
      setError(json.error)
    } else {
      setError(null)
      await loadPlayer()
    }
  }

  useEffect(() => {
    loadPlayer()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!player) return <div>No player found.</div>

  return (
    <div>
      <p>Company: {player.company_name}</p>
      <p>Cash: ${player.cash}</p>
      <button onClick={produce}>Produce 10 Mats (-$100)</button>
    </div>
  )
}
