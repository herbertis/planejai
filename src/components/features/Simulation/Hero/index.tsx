import PiggyBankImage from '@/assets/images/piggy-bank.png'

export function SimulationHero() {
  return (
    <div className="mb-8 text-center">
      <div className="relative inline-flex items-center justify-center">
        <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
          Vamos planejar seu futuro
        </h1>
        <img
          src={PiggyBankImage}
          alt=""
          aria-hidden="true"
          className="absolute -top-6 -right-16 h-16 w-16 sm:-top-8 sm:-right-20 sm:h-20 sm:w-20"
        />
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        Responda algumas questões para ter insights financeiros personalizados.
      </p>
    </div>
  )
}