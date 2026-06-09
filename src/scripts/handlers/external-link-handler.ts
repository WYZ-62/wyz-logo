import { siteConfig } from "@/config";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";

const MODAL_ID = "external-link-confirm-modal";
const OPEN_CLASS = "is-open";
const BODY_OPEN_CLASS = "external-link-confirm-open";
const PREFERRED_BRAND_IMAGE_SRC = "/assets/home/title.png";
const BRAND_IMAGE_SRC = resolveBrandImageSrc();

type ExternalTarget = "_blank" | "_self" | "_parent" | "_top";

interface PendingExternalLink {
	href: string;
	target: ExternalTarget;
}

let initialized = false;
let pendingExternalLink: PendingExternalLink | null = null;
let previousActiveElement: HTMLElement | null = null;

function getModal(): HTMLElement | null {
	return document.getElementById(MODAL_ID);
}

function getDialogElements() {
	const modal = getModal();

	return {
		modal,
		host: modal?.querySelector<HTMLElement>("[data-external-link-host]"),
		url: modal?.querySelector<HTMLElement>("[data-external-link-url]"),
		confirmButton: modal?.querySelector<HTMLButtonElement>(
			"[data-external-link-action='confirm']",
		),
	};
}

function normalizeTarget(target: string | null): ExternalTarget {
	switch (target) {
		case "_self":
		case "_parent":
		case "_top":
			return target;
		default:
			return "_blank";
	}
}

function isExternalHttpUrl(url: URL): boolean {
	return url.protocol === "http:" || url.protocol === "https:";
}

function shouldInterceptLink(anchor: HTMLAnchorElement): boolean {
	if (anchor.dataset.externalLinkConfirm === "false") {
		return false;
	}

	if (anchor.hasAttribute("download")) {
		return false;
	}

	const rawHref = anchor.getAttribute("href");
	if (!rawHref) {
		return false;
	}

	if (
		rawHref.startsWith("#") ||
		rawHref.startsWith("mailto:") ||
		rawHref.startsWith("tel:") ||
		rawHref.startsWith("javascript:")
	) {
		return false;
	}

	try {
		const targetUrl = new URL(anchor.href, window.location.href);
		return (
			isExternalHttpUrl(targetUrl) &&
			targetUrl.origin !== window.location.origin
		);
	} catch {
		return false;
	}
}

function resolveBrandImageSrc(): string {
	if (PREFERRED_BRAND_IMAGE_SRC) {
		const trimmedBase = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
		return `${trimmedBase}${PREFERRED_BRAND_IMAGE_SRC}`;
	}

	const rawSrc =
		siteConfig.navbarTitle?.icon || siteConfig.navbarTitle?.logo || "";

	if (!rawSrc) {
		return "";
	}

	if (/^(?:https?:)?\/\//.test(rawSrc) || rawSrc.startsWith("data:")) {
		return rawSrc;
	}

	const trimmedBase = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
	const normalizedPath = rawSrc.startsWith("/") ? rawSrc : `/${rawSrc}`;
	return `${trimmedBase}${normalizedPath}`;
}

function createExternalLinkModal(): HTMLElement {
	const existingModal = getModal();
	if (existingModal) {
		return existingModal;
	}

	const modal = document.createElement("div");
	modal.id = MODAL_ID;
	modal.className = "external-link-confirm";
	modal.setAttribute("aria-hidden", "true");
	modal.dataset.externalLinkModal = "true";

	modal.innerHTML = `
		<div class="external-link-confirm__backdrop" data-external-link-action="cancel"></div>
		<div class="external-link-confirm__dialog" role="dialog" aria-modal="true" aria-labelledby="external-link-confirm-title">
			<div class="external-link-confirm__header">
				<div class="external-link-confirm__brand-icon" aria-hidden="true">
					${
						BRAND_IMAGE_SRC
							? `<img src="${BRAND_IMAGE_SRC}" alt="" class="external-link-confirm__brand-image" loading="lazy" />`
							: `<svg viewBox="0 0 24 24" fill="none">
								<path d="M14 5h5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
								<path d="M10 14L19 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
								<path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
							</svg>`
					}
				</div>
				<div class="external-link-confirm__brand-copy">
					<span class="external-link-confirm__badge">${i18n(I18nKey.externalLinkBadge)}</span>
					<strong class="external-link-confirm__site-name">${siteConfig.title}</strong>
				</div>
			</div>

			<div class="external-link-confirm__panel">
				<h2 id="external-link-confirm-title" class="external-link-confirm__title">${i18n(I18nKey.externalLinkTitle)}</h2>
				<p class="external-link-confirm__description">${i18n(I18nKey.externalLinkDescription)}</p>
			</div>

			<div class="external-link-confirm__target-card">
				<span class="external-link-confirm__target-label">${i18n(I18nKey.externalLinkTarget)}</span>
				<strong class="external-link-confirm__target-host" data-external-link-host></strong>
				<p class="external-link-confirm__target-url" data-external-link-url></p>
			</div>

			<ul class="external-link-confirm__tips">
				<li>${i18n(I18nKey.externalLinkTipContent)}</li>
				<li>${i18n(I18nKey.externalLinkTipSecurity)}</li>
			</ul>

			<div class="external-link-confirm__actions">
				<button type="button" class="external-link-confirm__button external-link-confirm__button--ghost" data-external-link-action="cancel">
					${i18n(I18nKey.externalLinkCancel)}
				</button>
				<button type="button" class="external-link-confirm__button external-link-confirm__button--primary" data-external-link-action="confirm">
					${i18n(I18nKey.externalLinkContinue)}
				</button>
			</div>
		</div>
	`;

	document.body.appendChild(modal);
	return modal;
}

function updateModalContent(url: URL): void {
	const { host, url: urlElement } = getDialogElements();
	if (host) {
		host.textContent = url.hostname;
	}
	if (urlElement) {
		urlElement.textContent = url.href;
	}
}

function openModal(link: PendingExternalLink): void {
	const modal = createExternalLinkModal();
	const { confirmButton } = getDialogElements();
	const url = new URL(link.href, window.location.href);

	pendingExternalLink = link;
	previousActiveElement =
		document.activeElement instanceof HTMLElement
			? document.activeElement
			: null;

	updateModalContent(url);
	modal.classList.add(OPEN_CLASS);
	modal.setAttribute("aria-hidden", "false");
	document.body.classList.add(BODY_OPEN_CLASS);

	confirmButton?.focus();
}

function closeModal(): void {
	const modal = getModal();
	if (!modal) {
		return;
	}

	modal.classList.remove(OPEN_CLASS);
	modal.setAttribute("aria-hidden", "true");
	document.body.classList.remove(BODY_OPEN_CLASS);
	pendingExternalLink = null;

	previousActiveElement?.focus();
	previousActiveElement = null;
}

function confirmNavigation(): void {
	if (!pendingExternalLink) {
		return;
	}

	const { href, target } = pendingExternalLink;
	closeModal();

	if (target !== "_blank") {
		window.location.assign(href);
		return;
	}

	window.open(href, "_blank", "noopener,noreferrer");
}

function handleModalClick(event: MouseEvent): void {
	const target = event.target;
	if (!(target instanceof Element)) {
		return;
	}

	const actionElement = target.closest<HTMLElement>("[data-external-link-action]");
	if (!actionElement) {
		return;
	}

	const action = actionElement.dataset.externalLinkAction;
	if (action === "cancel") {
		closeModal();
		return;
	}

	if (action === "confirm") {
		confirmNavigation();
	}
}

function handleDocumentClick(event: MouseEvent): void {
	if (
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	) {
		return;
	}

	const target = event.target;
	if (!(target instanceof Element)) {
		return;
	}

	const anchor = target.closest<HTMLAnchorElement>("a[href]");
	if (!anchor || !shouldInterceptLink(anchor)) {
		return;
	}

	event.preventDefault();
	openModal({
		href: anchor.href,
		target: normalizeTarget(anchor.getAttribute("target")),
	});
}

function handleKeydown(event: KeyboardEvent): void {
	if (event.key === "Escape" && pendingExternalLink) {
		closeModal();
	}
}

export function openExternalLinkConfirm(
	href: string,
	target: ExternalTarget = "_blank",
): void {
	if (typeof window === "undefined" || !href) {
		return;
	}

	initExternalLinkHandler();
	openModal({
		href,
		target,
	});
}

export function initExternalLinkHandler(): void {
	if (initialized || typeof document === "undefined") {
		return;
	}

	const modal = createExternalLinkModal();
	modal.addEventListener("click", handleModalClick);
	document.addEventListener("click", handleDocumentClick, true);
	document.addEventListener("keydown", handleKeydown);
	initialized = true;
}
