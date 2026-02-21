import Signin from "./components/Signin"

function SigninPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(160deg,hsl(var(--background))_0%,hsl(var(--accent)/0.28)_45%,hsl(var(--background))_100%)]" />
      <div className="absolute -top-24 left-1/3 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-12 right-8 -z-10 h-72 w-72 rounded-full bg-accent/35 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Signin />
      </div>
    </section>
  )
}

export default SigninPage
