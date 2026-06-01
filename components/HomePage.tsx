'use client'

import Nav from './Nav'
import Hero from './Hero'
import AiConsult from './AiConsult'
import Booking from './Booking'
import Cases from './Cases'
import Shop from './Shop'
import Recruit from './Recruit'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import Toast from './Toast'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AiConsult />
        <Booking />
        <Cases />
        <Shop />
        <Recruit />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  )
}
