"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import heroImg1 from "@/assets/Hero/hero-img-1.webp"
import heroImg2 from "@/assets/Hero/hero-img-2.jpeg"
import heroImg3 from "@/assets/Hero/hero-img-3.jpeg"
import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"

const heroImages = [
  {
    id: 1,
    src: heroImg1,
    alt: "Burger discount image"
  },
  {
    id: 2,
    src: heroImg2,
    alt: "Fried Chicken discount image"
  },
  {
    id: 3,
    src: heroImg3,
    alt: "Food discount image"
  }
]

function Hero() {
  const autoplay = useRef(Autoplay({
    delay: 5000, stopOnInteraction: true

  }))
  return (
    <section className="h-[50svh] w-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-700 sm:h-[60svh] lg:h-[70svh] xl:h-[80svh] min-[1500px]:h-svh">
      <Carousel plugins={[autoplay.current]} className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent className="h-full ml-0">
          {
            heroImages.map((item) => {
              return <CarouselItem key={item.id} className="h-[50svh] p-0 pl-0! sm:h-[60svh] lg:h-[70svh] xl:h-[90svh] min-[1500px]:h-svh">
                <div className="relative h-full w-full">
                  <Image
                    src={item.src}
                    unoptimized
                    alt={item.alt}
                    fill
                    priority
                    className="object-[90%] md:object-[70%] lg:object-cover object-cover"
                  />
                </div>
              </CarouselItem>
            })
          }
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 z-10 -translate-y-1/2 transition-transform hover:scale-105" />
        <CarouselNext className="right-4 top-1/2 z-10 -translate-y-1/2 transition-transform hover:scale-105" />
      </Carousel>
    </section>
  )
}

export default Hero
