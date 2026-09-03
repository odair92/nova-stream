import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

import type { ContactSettings, FooterSettings, HeaderSettings, SiteSettings } from "@/lib/types";

export function SiteFooter({
  site,
  footer,
  contact,
  header,
}: {
  site: SiteSettings;
  footer: FooterSettings;
  contact: ContactSettings;
  header: HeaderSettings;
}) {
  return (
    <footer id="contato" className="border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <span className="font-display text-2xl text-primary">{site.logo_text || site.name}</span>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{footer.description}</p>
          <div className="mt-5 flex gap-3">
            {contact.instagram ? (
              <a
                href={contact.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
            ) : null}
            {contact.facebook ? (
              <a
                href={contact.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <nav className="text-sm">
          <h3 className="text-base">Navegação</h3>
          <ul className="mt-4 space-y-2">
            {header.menu?.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="text-base">Contato</h3>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {contact.email ? (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            ) : null}
            {contact.phone ? (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </li>
            ) : null}
          </ul>
          <ul className="mt-5 space-y-2">
            <li>
              <Link to="/termos" className="text-muted-foreground hover:text-foreground">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        {footer.copyright}
      </div>
    </footer>
  );
}
