import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    id: 1,
    question: "How long does delivery usually take?",
    answer:
      "Most orders arrive within 20 to 35 minutes depending on distance, restaurant prep time, and peak-hour traffic.",
  },
  {
    id: 2,
    question: "Can I schedule an order for later?",
    answer:
      "Yes. You can place an order in advance and choose your preferred delivery time during checkout.",
  },
  {
    id: 3,
    question: "What payment methods are available?",
    answer:
      "We support cards, mobile wallets, and cash on delivery in selected service areas.",
  },
  {
    id: 4,
    question: "What if an item is missing from my order?",
    answer:
      "Report the issue from your order history and our support team will quickly arrange a refund or replacement based on policy.",
  },
  {
    id: 5,
    question: "Do you offer vegetarian and healthy options?",
    answer:
      "Yes. Use category filters to find vegetarian, low-calorie, and high-protein meals from nearby kitchens.",
  },
]

async function Faq() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 sm:px-6 lg:px-8">
      <div className="mb-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Support</p>
        <h2 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
      </div>

      <Accordion type="single" defaultValue="item-1" className="space-y-3">
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={`item-${item.id}`}
            style={{ animationDelay: `${item.id * 70}ms` }}
            className="rounded-xl border border-border bg-card px-4 shadow-sm transition hover:border-primary/35 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          >
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="border-t border-border pt-3 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default Faq
