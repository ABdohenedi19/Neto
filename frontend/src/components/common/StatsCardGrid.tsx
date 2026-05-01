import { StatCard } from './StatCard'
import type { OverviewCardData } from '../../types'

export const StatsCardGrid = ({ cards }: { cards: OverviewCardData[] }) => (
  <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
    {cards.map((card, index) => (
      <StatCard
        key={card.title}
        title={card.title}
        value={card.value}
        trend={card.trend}
        positive={card.positive}
        highlight={index === 2}
      />
    ))}
  </div>
)
