'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [player, setPlayer] = useState<any>(null)

  async function loadPlayer() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .limit(1)
      .single()

    setPlayer(data)
  }

  async function produce() {
    await fetch('/api/produce', { method: 'POST' })
    await loadPlayer()
  }

  useEffect(() => {
    loadPlayer()
  }, [])

  if (!player) return <div>Loading...</div>

  return (
    <div>
      <p>Company: {player.company_name}</p>
      <p>Cash: ${player.cash}</p>
      <button onClick={produce}>Produce 10 Mats (-$100)</button>
    </div>
  )
}
