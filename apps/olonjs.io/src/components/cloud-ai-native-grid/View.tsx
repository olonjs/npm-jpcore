import type { CloudAiNativeGridData, CloudAiNativeGridSettings } from './types';

interface CloudAiNativeGridViewProps {
  data: CloudAiNativeGridData;
  settings?: CloudAiNativeGridSettings;
}

export function CloudAiNativeGridView({ data }: CloudAiNativeGridViewProps) {
  const mattersMatch = data.titleGradient.match(/^(.*)\s(MATTERS|Matters|matters)$/);
  const gradientPart = mattersMatch ? mattersMatch[1] : data.titleGradient;
  const whiteSuffix  = mattersMatch ? ` ${mattersMatch[2]}` : null;

  return (
    <section id={data.anchorId} className="max-w-4xl mx-auto px-6 mb-24 animate-fadeInUp delay-500 section-anchor">

      <h1 className="text-left text-5xl font-display font-bold mb-4 text-foreground">
        <span data-jp-field="titlePrefix">{data.titlePrefix} </span>
        <span
          className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent"
          data-jp-field="titleGradient"
        >
          {gradientPart}
        </span>
        {whiteSuffix && <span className="text-foreground">{whiteSuffix}</span>}
      </h1>
      <p
        className="text-left text-base text-muted-foreground mb-12 max-w-2xl "
        data-jp-field="description"
      >
        {data.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.cards.map((card) => (
          <article
            key={card.id ?? card.title}
            data-jp-item-id={card.id ?? card.title}
            data-jp-item-field="cards"
            className="jp-feature-card card-hover p-8 rounded-2xl"
          >
            <img
              src={card.icon.url}
              alt={card.icon.alt ?? card.title}
              className="w-10 h-10 mb-4"
              data-jp-field="icon"
            />
            <h3 className="text-xl font-display mb-3 text-foreground" data-jp-field="title">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-jp-field="description">{card.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
}
