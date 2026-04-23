
// =========================
// app/api/produce/route.ts
// =========================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST() {
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .limit(1)
    .single()

  if (!player || player.cash < 100) {
    return NextResponse.json({ error: 'Not enough cash' })
  }

  await supabase
    .from('players')
    .update({ cash: player.cash - 100 })
    .eq('id', player.id)

  const { data: inv } = await supabase
  .from('inventory')
  .select('quantity')
  .eq('player_id', player.id)
  .eq('product', 'basic_mat')
  .single()

await supabase.from('inventory').upsert(
  { player_id: player.id, product: 'basic_mat', quantity: (inv?.quantity ?? 0) + 10 },
  { onConflict: 'player_id,product' }
)

  return NextResponse.json({ success: true })
}
