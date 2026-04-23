import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST() {
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*')
    .limit(1)
    .single()

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  if (player.cash < 100) {
    return NextResponse.json({ error: 'Not enough cash' }, { status: 400 })
  }

  const { error: cashError } = await supabase
    .from('players')
    .update({ cash: player.cash - 100 })
    .eq('id', player.id)

  if (cashError) {
    return NextResponse.json({ error: 'Failed to update cash' }, { status: 500 })
  }

  const { data: inv } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('player_id', player.id)
    .eq('product', 'basic_mat')
    .single()

  const { error: invError } = await supabase
    .from('inventory')
    .upsert(
      { player_id: player.id, product: 'basic_mat', quantity: (inv?.quantity ?? 0) + 10 },
      { onConflict: 'player_id,product' }
    )

  if (invError) {
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
