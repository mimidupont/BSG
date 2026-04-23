
// =========================
// app/api/produce/route.ts
// =========================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
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

  await supabase.from('inventory').upsert({
    player_id: player.id,
    product: 'basic_mat',
    quantity: 10
  })

  return NextResponse.json({ success: true })
}
