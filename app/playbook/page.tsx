function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border rounded-lg p-6">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function PlaybookPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">The Playbook</h1>

      <Section title="Is Rank & Rent Still Viable?">
        <p>
          Yes, but the model has matured. Mainstream consumer home-service trades are colonized
          nationwide by franchises/multi-city operators even in towns of ~1,200 people — town
          size does not protect you. The categories that work now are structurally different from
          the classic playbook: institutional/B2B buyer niches and fragmented small-business
          niches (see the dataset), not generic &ldquo;plumber/electrician/landscaper.&rdquo;
        </p>
      </Section>

      <Section title="Realistic Timeline">
        <div>
          <p className="font-semibold">Organic-only phase (no Google Business Profile yet):</p>
          <p>
            Months 1–2, site indexed, ranking page 2–3, minimal leads. Months 3–4, early
            long-tail movement, a lead trickle begins. Months 5–6, first-page rankings on core
            terms — this is when the site is demo-able to a prospective tenant.
          </p>
        </div>
        <div>
          <p className="font-semibold">After adding a GBP (month 6+):</p>
          <p>
            Weeks 1–2, listing goes live for low-competition long-tail searches. Weeks 4–8, real
            map-pack movement as reviews/citations build. Months 3–6 post-GBP, competitive
            positions on core terms.
          </p>
        </div>
      </Section>

      <Section title="Building Multiple Sites Without Triggering Spam Detection">
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>Stagger builds — don&apos;t launch everything on the same day from the same IP/registrar/template.</li>
          <li>Genuinely differentiate design, hosting, and content between sites.</li>
          <li>Write real, specific local content, not templated city-swaps.</li>
          <li>
            Use a real, working phone number with call tracking from day one (Google Voice or
            CallRail), forwarded to yourself before a tenant exists, so there&apos;s provable
            lead data to demo.
          </li>
          <li>
            Word every site as a referral/marketing service connecting customers to licensed
            providers — not as the business itself offering the (possibly licensed) work. This
            both reduces spam-policy risk and sidesteps advertising-disclosure law concerns for
            regulated trades.
          </li>
          <li>Recommended pace: 2–3 sites at a time, well differentiated, not 10 at once.</li>
        </ul>
      </Section>

      <Section title="Domains & Hosting">
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>
            Registrar (Namecheap, GoDaddy, Cloudflare) = where the domain is purchased. Host
            (Netlify) = where the site actually lives. Buy from a registrar, point DNS at Netlify.
          </li>
          <li>
            Always use a real custom domain, never the free <code className="bg-slate-100 px-1 rounded">netlify.app</code> subdomain —
            it hurts conversion trust and citation-building.
          </li>
          <li>
            Spread domain purchases across a couple of registrars and stagger purchase dates to
            avoid an obvious &ldquo;network&rdquo; footprint.
          </li>
        </ul>
      </Section>

      <Section title="International Expansion">
        <p>
          The premise that other English-speaking countries are automatically less saturated than
          the US does not hold up. The US advantage is sheer size (a huge number of mid-size
          towns), not lower saturation generally.
        </p>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>
            <strong>Canada</strong> is the most natural fit if expanding — same map-pack
            mechanics, similar franchise landscape, large landmass with many mid-size towns
            similar to the US pattern. Quebec needs genuine French content.
          </li>
          <li>
            <strong>UK</strong> is smaller and denser; London absorbs disproportionate
            competition. Older architectural/religious history means some &ldquo;dying
            craft&rdquo; niches that work well in the US (pipe organs, confirmed) are actually
            <em> more</em> saturated there — the UK has a much deeper centuries-old tradition of
            church organs.
          </li>
          <li>
            <strong>Australia/New Zealand</strong> are extremely urban-concentrated (population
            clustered in a handful of major metros) — neither has the long tail of independent
            mid-size towns that made the US target list work.
          </li>
          <li>
            <strong>Mexico</strong> has the same ranking mechanics but requires genuinely fluent
            (not machine-translated) Spanish content, and real buyer behavior in many SMB sectors
            leans more on WhatsApp/word-of-mouth than Google search — validate real search volume
            before committing.
          </li>
        </ul>
      </Section>
    </div>
  );
}
