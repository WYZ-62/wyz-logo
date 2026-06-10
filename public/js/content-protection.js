(function () {
	const MANAGER_KEY = "__mizukiContentProtectionManager";
	const CONFIG_ELEMENT_ID = "content-protection-config";
	const EDITABLE_SELECTOR =
		'input, textarea, select, [contenteditable="true"], [contenteditable=""]';
	const CODE_SELECTOR = "pre, code, .copy-btn, .expressive-code, .astro-code";

	function readConfig() {
		const configElement = document.getElementById(CONFIG_ELEMENT_ID);
		if (!configElement?.textContent) {
			return null;
		}

		try {
			return JSON.parse(configElement.textContent);
		} catch (error) {
			console.error("Failed to parse content protection config:", error);
			return null;
		}
	}

	class ContentProtectionManager {
		constructor(config) {
			this.config = config;
			this.mutationObserver = null;
			this.refreshScheduled = false;
			this.init();
		}

		init() {
			this.refresh();

			if (this.config.disableContextMenu) {
				document.addEventListener(
					"contextmenu",
					this.handleContextMenu,
					true,
				);
			}

			if (this.config.disableCopy) {
				document.addEventListener("copy", this.handleCopyLike, true);
				document.addEventListener("cut", this.handleCopyLike, true);
				document.addEventListener("keydown", this.handleKeydown, true);
			} else if (this.config.disableDevToolsShortcuts) {
				document.addEventListener("keydown", this.handleKeydown, true);
			}

			document.addEventListener("astro:page-load", this.refresh);
			document.addEventListener("swup:contentReplaced", this.refresh);
			document.addEventListener("password:unlock", this.scheduleRefresh);

			this.mutationObserver = new MutationObserver(() => {
				this.scheduleRefresh();
			});

			if (document.body) {
				this.mutationObserver.observe(document.body, {
					childList: true,
					subtree: true,
				});
			}
		}

		refresh = () => {
			this.refreshScheduled = false;
			this.config.protectedSelectors.forEach((selector) => {
				document.querySelectorAll(selector).forEach((element) => {
					if (element instanceof HTMLElement) {
						element.setAttribute("data-copy-protected", "true");
					}
				});
			});
		};

		scheduleRefresh = () => {
			if (this.refreshScheduled) {
				return;
			}
			this.refreshScheduled = true;
			requestAnimationFrame(this.refresh);
		};

		getProtectedRoot(node) {
			if (!(node instanceof Node)) {
				return null;
			}

			const element = node instanceof Element ? node : node.parentElement;
			if (!element) {
				return null;
			}

			for (const selector of this.config.protectedSelectors) {
				const root = element.closest(selector);
				if (root) {
					return root;
				}
			}

			return null;
		}

		isEditableTarget(target) {
			return (
				target instanceof Element &&
				Boolean(target.closest(EDITABLE_SELECTOR))
			);
		}

		isAllowedCodeTarget(target) {
			return (
				this.config.allowCodeCopy &&
				target instanceof Element &&
				Boolean(target.closest(CODE_SELECTOR))
			);
		}

		selectionTouchesProtectedArea() {
			const selection = window.getSelection();
			if (
				!selection ||
				selection.rangeCount === 0 ||
				selection.isCollapsed
			) {
				return false;
			}

			const range = selection.getRangeAt(0);
			const startRoot = this.getProtectedRoot(range.startContainer);
			const endRoot = this.getProtectedRoot(range.endContainer);

			if (!startRoot && !endRoot) {
				return false;
			}

			if (this.config.allowCodeCopy) {
				const commonElement =
					range.commonAncestorContainer instanceof Element
						? range.commonAncestorContainer
						: range.commonAncestorContainer.parentElement;

				if (commonElement?.closest(CODE_SELECTOR)) {
					return false;
				}
			}

			return true;
		}

		handleContextMenu = (event) => {
			const target = event.target;
			if (
				this.isEditableTarget(target) ||
				this.isAllowedCodeTarget(target)
			) {
				return;
			}

			if (this.getProtectedRoot(target)) {
				event.preventDefault();
			}
		};

		handleCopyLike = (event) => {
			const target = event.target;
			if (
				this.isEditableTarget(target) ||
				this.isAllowedCodeTarget(target)
			) {
				return;
			}

			if (
				this.getProtectedRoot(target) ||
				this.selectionTouchesProtectedArea()
			) {
				event.preventDefault();
			}
		};

		handleKeydown = (event) => {
			const key = String(event.key || "").toLowerCase();
			const isCopyCommand =
				(event.ctrlKey || event.metaKey) &&
				(key === "c" || key === "x");
			const isDevToolsShortcut =
				key === "f12" ||
				((event.ctrlKey || event.metaKey) &&
					event.shiftKey &&
					(key === "i" || key === "j")) ||
				((event.ctrlKey || event.metaKey) && key === "u");

			if (this.config.disableDevToolsShortcuts && isDevToolsShortcut) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			if (!isCopyCommand) {
				return;
			}

			const target = event.target;
			if (
				this.isEditableTarget(target) ||
				this.isAllowedCodeTarget(target)
			) {
				return;
			}

			if (
				this.getProtectedRoot(target) ||
				this.selectionTouchesProtectedArea()
			) {
				event.preventDefault();
			}
		};
	}

	function initContentProtection() {
		const config = readConfig();
		if (!config) {
			return;
		}

		if (window[MANAGER_KEY]) {
			window[MANAGER_KEY].config = config;
			window[MANAGER_KEY].refresh();
			return;
		}

		window[MANAGER_KEY] = new ContentProtectionManager(config);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initContentProtection, {
			once: true,
		});
	} else {
		initContentProtection();
	}
})();
