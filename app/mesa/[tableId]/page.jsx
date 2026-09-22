import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TableDashboard({ params }) {
  // En Next.js moderno, params es una promesa y debemos resolverla
  const resolvedParams = await params
  const tableId = resolvedParams.tableId

  // 1. Buscamos la mesa y el restaurante asociado en Supabase
  const { data: tableData, error: tableError } = await supabase
    .from('tables')
    .select(`
      id,
      table_number,
      restaurants (
        id,
        name,
        slug
      )
    `)
    .eq('id', tableId)
    .single()

  if (tableError || !tableData) {
    return (
      <main className="p-8 text-center bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold text-red-600">Mesa no encontrada</h1>
        <p className="text-gray-600 mt-2">ID recibido: {tableId}</p>
        <p className="text-gray-500 text-xs mt-1">Verifica que el código UUID en la URL sea el correcto.</p>
      </main>
    )
  }

  const restaurant = tableData.restaurants

  return (
    <main className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 text-center">
        
        {/* Logo / Iniciales o Avatar del Restaurante */}
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-lg mb-4 text-white">
          {restaurant?.name ? restaurant.name.charAt(0) : 'R'}
        </div>

        {/* Nombre del Local y Número de Mesa */}
        <h1 className="text-2xl font-black tracking-wide">{restaurant?.name || 'Restaurante'}</h1>
        <p className="text-indigo-400 font-medium text-sm mt-1">
          Estás sentado en la <span className="underline">{tableData.table_number}</span> 🥂
        </p>

        <div className="my-8 border-t border-gray-700"></div>

        {/* Las 3 Opciones del Dashboard Inicial */}
        <div className="space-y-4">
          
          {/* Opción 1: Ver Carta Normal */}
          <Link 
            href={`/menu/${restaurant?.slug}`}
            className="block w-full bg-gray-700 hover:bg-gray-600 transition p-4 rounded-2xl text-left border border-gray-600 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-300 transition">📖 Ver Carta Digital</h3>
                <p className="text-xs text-gray-400 mt-0.5">Explora el menú y los precios del local.</p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </div>
          </Link>

          {/* Opción 2: Cuenta Compartida */}
          <Link 
            href={`/mesa/${tableId}/cuenta`}
            className="block w-full bg-indigo-600 hover:bg-indigo-500 transition p-4 rounded-2xl text-left shadow-lg shadow-indigo-600/30 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">💳 Cuenta Compartida</h3>
                <p className="text-xs text-indigo-200 mt-0.5">Únete a la mesa, pide en vivo y divide gastos.</p>
              </div>
              <span className="text-white text-lg">→</span>
            </div>
          </Link>

          {/* Opción 3: Ayuda / Dudas */}
          <Link 
            href={`/mesa/${tableId}/ayuda`}
            className="block w-full bg-gray-700 hover:bg-gray-600 transition p-4 rounded-2xl text-left border border-gray-600 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-indigo-300 transition">❓ ¿Cómo funciona?</h3>
                <p className="text-xs text-gray-400 mt-0.5">Guía rápida sobre la app y la calculadora.</p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </div>
          </Link>

        </div>

        <p className="text-xs text-gray-500 mt-8">
          Powered by Tu Menú App ⚡
        </p>

      </div>
    </main>
  )
}