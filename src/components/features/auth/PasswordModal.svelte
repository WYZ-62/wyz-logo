<script lang="ts">
	import I18nKey from "@i18n/i18nKey";
	import { i18n } from "@i18n/translation";
	import { onMount } from "svelte";

	type SuccessDetail = {
		message?: string;
		subMessage?: string;
	};

	const {
		hint = "",
		successMessage = "原来你也记得",
		successSubMessage = "只是被时间轻轻藏起",
	} = $props();

	const backgroundImage = "/assets/auth/erli.png";
	const middleMemoryLine = "有些东西从未消失";

	let errorMessage = $state("");
	let isLoading = $state(false);
	let isUnlockSequence = $state(false);
	let isMessageVisible = $state(false);
	let password = $state("");
	let successCopyOverride = $state<SuccessDetail | null>(null);

	let petalCanvas: HTMLCanvasElement | null = null;
	let revealTimer = 0;

	function getMemoryLines() {
		return [
			successCopyOverride?.message || successMessage,
			middleMemoryLine,
			successCopyOverride?.subMessage || successSubMessage,
		];
	}

	function clearRevealTimer() {
		if (revealTimer) {
			window.clearTimeout(revealTimer);
			revealTimer = 0;
		}
	}

	function startUnlockSequence(detail?: SuccessDetail) {
		clearRevealTimer();
		errorMessage = "";
		isLoading = false;
		password = "";
		successCopyOverride = detail || {};
		isUnlockSequence = true;
		isMessageVisible = false;

		revealTimer = window.setTimeout(() => {
			isMessageVisible = true;
		}, 1400);
	}

	function resetUnlockScene() {
		clearRevealTimer();
		isUnlockSequence = false;
		isMessageVisible = false;
		successCopyOverride = null;
	}

	function dispatchUnlock(pwd: string) {
		const event = new CustomEvent("password:unlock", {
			detail: { password: pwd },
			bubbles: true,
			composed: true,
		});
		document.dispatchEvent(event);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (password.trim() && !isUnlockSequence && !isLoading) {
			dispatchUnlock(password);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (
			e.key === "Enter" &&
			password.trim() &&
			!isUnlockSequence &&
			!isLoading
		) {
			dispatchUnlock(password);
		}
	}

	function setupPetals() {
		if (!petalCanvas || typeof window === "undefined") {
			return () => {};
		}

		const ctx = petalCanvas.getContext("2d");
		if (!ctx) {
			return () => {};
		}

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let width = 0;
		let height = 0;
		let rafId = 0;

		type Petal = {
			x: number;
			y: number;
			size: number;
			vx: number;
			vy: number;
			rotation: number;
			spin: number;
			alpha: number;
		};

		const petalCount = 42;
		const petals: Petal[] = [];

		const createPetal = (offsetY = false): Petal => ({
			x: Math.random() * Math.max(width, 1),
			y: offsetY
				? Math.random() * Math.max(height, 1)
				: -20 - Math.random() * Math.max(height, 1),
			size: 8 + Math.random() * 10,
			vx: -0.35 + Math.random() * 0.8,
			vy: 0.65 + Math.random() * 1.2,
			rotation: Math.random() * Math.PI * 2,
			spin: -0.01 + Math.random() * 0.02,
			alpha: 0.38 + Math.random() * 0.34,
		});

		const resize = () => {
			width = petalCanvas?.clientWidth || window.innerWidth;
			height = petalCanvas?.clientHeight || window.innerHeight;
			petalCanvas.width = Math.round(width * dpr);
			petalCanvas.height = Math.round(height * dpr);
			petalCanvas.style.width = `${width}px`;
			petalCanvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			petals.length = 0;
			for (let i = 0; i < petalCount; i += 1) {
				petals.push(createPetal(true));
			}
		};

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			petals.forEach((petal) => {
				petal.x += petal.vx;
				petal.y += petal.vy;
				petal.rotation += petal.spin;

				if (
					petal.y > height + 28 ||
					petal.x < -32 ||
					petal.x > width + 32
				) {
					Object.assign(petal, createPetal());
				}

				ctx.save();
				ctx.translate(petal.x, petal.y);
				ctx.rotate(petal.rotation);
				ctx.globalAlpha = petal.alpha;
				ctx.fillStyle = "rgba(255, 190, 212, 0.86)";
				ctx.shadowColor = "rgba(255, 218, 228, 0.36)";
				ctx.shadowBlur = 12;
				ctx.beginPath();
				ctx.ellipse(
					0,
					0,
					petal.size * 0.62,
					petal.size,
					Math.PI / 3,
					0,
					Math.PI * 2,
				);
				ctx.fill();
				ctx.restore();
			});

			rafId = window.requestAnimationFrame(draw);
		};

		resize();
		draw();
		window.addEventListener("resize", resize);

		return () => {
			window.cancelAnimationFrame(rafId);
			window.removeEventListener("resize", resize);
		};
	}

	onMount(() => {
		const cleanupPetals = setupPetals();

		const handleLoading = ((e: CustomEvent<boolean>) => {
			if (!isUnlockSequence) {
				isLoading = e.detail;
			}
		}) as EventListener;

		const handleError = ((e: CustomEvent<string>) => {
			errorMessage = e.detail;
			isLoading = false;
			resetUnlockScene();
		}) as EventListener;

		const handleClearError = (() => {
			errorMessage = "";
		}) as EventListener;

		const handleSuccess = ((e: CustomEvent<SuccessDetail>) => {
			startUnlockSequence(e.detail);
		}) as EventListener;

		document.addEventListener("password:loading", handleLoading);
		document.addEventListener("password:error", handleError);
		document.addEventListener("password:clear-error", handleClearError);
		document.addEventListener("password:success", handleSuccess);

		return () => {
			clearRevealTimer();
			cleanupPetals();
			document.removeEventListener("password:loading", handleLoading);
			document.removeEventListener("password:error", handleError);
			document.removeEventListener(
				"password:clear-error",
				handleClearError,
			);
			document.removeEventListener("password:success", handleSuccess);
		};
	});
</script>

<div class:unlock={isUnlockSequence} class="password-protection">
	<div
		class="bg"
		style={`background-image: url('${backgroundImage}');`}
		aria-hidden="true"
	></div>
	<div class="glow" aria-hidden="true"></div>
	<canvas bind:this={petalCanvas} class="scene-canvas sakura-layer"></canvas>

	<div class:card-hidden={isUnlockSequence} class="card">
		<div class="lock">🔒</div>
		<div class="card-title">{i18n(I18nKey.passwordProtected)}</div>

		{#if hint}
			<p class="hint">提示：{hint}</p>
		{/if}

		<form class="password-form" onsubmit={handleSubmit}>
			<input
				type="password"
				id="password-input"
				placeholder={i18n(I18nKey.passwordPlaceholder)}
				class="password-input"
				bind:value={password}
				onkeydown={handleKeydown}
				disabled={isLoading || isUnlockSequence}
				autocomplete="off"
			/>
			<button
				id="unlock-btn"
				class="unlock-button"
				type="submit"
				disabled={isLoading || isUnlockSequence}
			>
				{isLoading
					? i18n(I18nKey.passwordUnlocking)
					: i18n(I18nKey.passwordUnlock)}
			</button>
		</form>

		{#if errorMessage && !isUnlockSequence}
			<p class="error-message">{errorMessage}</p>
		{/if}
	</div>

	<div class:show={isMessageVisible} class="message">
		{#if isMessageVisible}
			{#each getMemoryLines() as line, index}
				<div class="line" style={`animation-delay:${index * 1.2}s`}>
					{line}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.password-protection {
		position: relative;
		min-height: min(82vh, 54rem);
		border-radius: 1.8rem;
		overflow: hidden;
		background: #050608;
		isolation: isolate;
		box-shadow:
			0 26px 70px -46px rgba(0, 0, 0, 0.72),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.bg,
	.glow,
	.scene-canvas,
	.card,
	.message {
		position: absolute;
		inset: 0;
	}

	.bg {
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		transform: scale(1.12);
		filter: brightness(0.78) contrast(1.16) saturate(1.08);
		transition:
			transform 6s ease,
			filter 6s ease;
	}

	.unlock .bg {
		transform: scale(1.22);
		filter: brightness(0.9) contrast(1.24) saturate(1.18);
	}

	.glow {
		background:
			linear-gradient(180deg, rgba(3, 5, 12, 0.24), rgba(3, 5, 12, 0.54)),
			radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08), transparent 45%),
			radial-gradient(circle at 72% 58%, rgba(160, 200, 255, 0.1), transparent 50%);
		animation: breathe 5s ease-in-out infinite;
	}

	.scene-canvas {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.sakura-layer {
		z-index: 1;
	}

	.card {
		inset: 50% auto auto 50%;
		width: min(22.5rem, calc(100% - 2rem));
		height: fit-content;
		padding: 1.75rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: white;
		text-align: center;
		transform: translate(-50%, -50%);
		transition:
			opacity 0.8s ease,
			transform 0.8s ease,
			filter 0.8s ease;
		z-index: 2;
	}

	.card-hidden {
		opacity: 0;
		transform: translate(-50%, -55%) scale(1.2);
		filter: blur(12px);
		pointer-events: none;
	}

	.lock {
		font-size: 2.9rem;
		line-height: 1;
		animation: float 3s ease-in-out infinite;
	}

	.card-title {
		margin-top: 0.8rem;
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.hint {
		margin-top: 0.8rem;
		font-size: 0.9rem;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.8);
	}

	.password-form {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
	}

	.password-input,
	.unlock-button {
		width: 100%;
		border-radius: 0.8rem;
	}

	.password-input {
		padding: 0.85rem 0.95rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.08);
		color: white;
		font-size: 0.95rem;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.password-input::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}

	.password-input:focus {
		border-color: rgba(255, 255, 255, 0.42);
		background: rgba(255, 255, 255, 0.12);
		box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.08);
	}

	.unlock-button {
		margin-top: 0.9rem;
		padding: 0.85rem 1rem;
		border: none;
		font-size: 0.98rem;
		font-weight: 700;
		color: #1c2740;
		background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
		cursor: pointer;
		box-shadow: 0 18px 30px -22px rgba(142, 197, 252, 0.9);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}

	.unlock-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 22px 34px -22px rgba(142, 197, 252, 0.95);
	}

	.unlock-button:active:not(:disabled) {
		transform: scale(0.985);
	}

	.unlock-button:disabled {
		opacity: 0.75;
		cursor: not-allowed;
	}

	.error-message {
		margin-top: 0.9rem;
		font-size: 0.88rem;
		line-height: 1.6;
		color: #ffd2df;
	}

	.message {
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		padding: 2rem;
		color: white;
		text-align: center;
		opacity: 0;
		transition: opacity 1s ease;
		pointer-events: none;
	}

	.message.show {
		opacity: 1;
	}

	.line {
		opacity: 0;
		transform: translateY(10px);
		font-size: clamp(1.05rem, 2.4vw, 1.55rem);
		line-height: 1.7;
		letter-spacing: 0.06em;
		text-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		animation: fadeUp 1.2s forwards;
	}

	.line:nth-child(2),
	.line:nth-child(3) {
		font-size: clamp(0.96rem, 2vw, 1.2rem);
		color: rgba(255, 255, 255, 0.92);
	}

	@keyframes breathe {
		0%,
		100% {
			opacity: 0.52;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	@keyframes fadeUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.password-protection {
			min-height: min(76vh, 43rem);
			border-radius: 1.35rem;
		}

		.card {
			padding: 1.35rem 1rem;
		}

		.lock {
			font-size: 2.5rem;
		}

		.card-title {
			font-size: 1rem;
		}

		.hint,
		.password-input,
		.unlock-button,
		.error-message {
			font-size: 0.9rem;
		}

		.message {
			padding: 1.35rem;
		}
	}
</style>
