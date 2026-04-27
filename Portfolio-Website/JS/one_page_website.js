const lightbox = document.getElementById('portfolio-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxPosition = document.getElementById('lightbox-position');
const lightboxLink = document.getElementById('lightbox-link');
const portfolioLinks = document.querySelectorAll('.photo-grid a');
const closeControls = document.querySelectorAll('[data-lightbox-close]');
const previousControl = document.querySelector('[data-lightbox-prev]');
const nextControl = document.querySelector('[data-lightbox-next]');
const lightboxTransitionDuration = 300;
const lightboxImageFadeDuration = 220;
const lightboxAutoAdvanceDelay = 3500;
const navbarLinks = document.querySelectorAll('.sidenav a[href^="#"]');
const navbarScrollDuration = 1000;

// Build a simple gallery list from the portfolio tiles.
const galleryItems = Array.from(portfolioLinks).map((link) => {
	const image = link.querySelector('img');
	const caption = link.querySelector('.screenshot-comment');

	return {
		image,
		caption: caption ? caption.textContent.trim() : image ? image.alt : '',
		url: link.href
	};
});

let closeLightboxTimeout;
let activeGalleryIndex = -1;
let lightboxAutoAdvanceInterval;
let isLightboxImageHovered = false;
let lightboxImageTransitionTimeout;
let lightboxImageTransitionToken = 0;

function stopLightboxAutoAdvance() {
	if (lightboxAutoAdvanceInterval) {
		window.clearInterval(lightboxAutoAdvanceInterval);
		lightboxAutoAdvanceInterval = undefined;
	}
}

function startLightboxAutoAdvance() {
	if (!lightbox || galleryItems.length <= 1 || isLightboxImageHovered || !lightbox.classList.contains('is-visible')) {
		return;
	}

	stopLightboxAutoAdvance();
	lightboxAutoAdvanceInterval = window.setInterval(() => {
		if (!lightbox.classList.contains('is-visible') || isLightboxImageHovered) {
			return;
		}

		showNextItem();
	}, lightboxAutoAdvanceDelay);
}

// Keep the selected thumbnail highlighted.
function updateActiveThumbnail() {
	const thumbnailButtons = lightboxThumbnails.querySelectorAll('.lightbox-thumbnail');

	thumbnailButtons.forEach((button, index) => {
		const isActive = index === activeGalleryIndex;
		button.classList.toggle('is-active', isActive);
		button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

		if (isActive) {
			button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	});
}

// Add the small clickable thumbnails under the main image.
function buildThumbnailGallery() {
	const thumbnailMarkup = galleryItems 
		.map((item, index) => {
			if (!item.image) {
				return '';
			}

			return '<button type="button" class="lightbox-thumbnail" data-lightbox-thumb="' + index + '" aria-label="Show ' + item.caption + '" aria-pressed="false">'
				+ '<img src="' + item.image.src + '" alt="' + item.image.alt + '">' 
				+ '</button>'; 
		})
		.join('');

	lightboxThumbnails.innerHTML = thumbnailMarkup;

	lightboxThumbnails.querySelectorAll('[data-lightbox-thumb]').forEach((button) => {
		button.addEventListener('click', () => {
			showGalleryItem(Number(button.getAttribute('data-lightbox-thumb')));
		});
	});
}

// Wait until the close animation finishes before clearing the content.
function closeLightbox() {
	window.clearTimeout(closeLightboxTimeout);
	window.clearTimeout(lightboxImageTransitionTimeout);
	lightboxImageTransitionToken += 1;
	stopLightboxAutoAdvance();
	isLightboxImageHovered = false;
	activeGalleryIndex = -1;
	lightbox.classList.remove('is-visible');
	lightbox.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('lightbox-open');
	lightboxImage.classList.remove('is-fading');
	closeLightboxTimeout = window.setTimeout(() => {
		lightboxImage.src = '';
		lightboxImage.alt = '';
		lightboxCaption.textContent = '';
		lightboxPosition.textContent = '';
		lightboxLink.href = '#';
		updateActiveThumbnail();
	}, lightboxTransitionDuration);
}

function applyGalleryItemToLightbox(item, index) {
	lightboxImage.src = item.image.src;
	lightboxImage.alt = item.image.alt;
	lightboxCaption.textContent = item.caption;
	lightboxPosition.textContent = 'Image ' + (index + 1) + ' of ' + galleryItems.length;
	lightboxLink.href = item.url;
}

// Wrap the index so the gallery loops.
function showGalleryItem(index, options = {}) {
	const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
	const item = galleryItems[normalizedIndex];
	const animate = options.animate !== false;

	if (!item || !item.image) {
		return;
	}

	window.clearTimeout(lightboxImageTransitionTimeout);
	lightboxImageTransitionToken += 1;
	activeGalleryIndex = normalizedIndex;
	updateActiveThumbnail();

	const canAnimateImageSwap = animate && lightbox.classList.contains('is-visible') && !!lightboxImage.src;
	if (!canAnimateImageSwap) {
		lightboxImage.classList.remove('is-fading');
		applyGalleryItemToLightbox(item, normalizedIndex);
		return;
	}

	const transitionToken = lightboxImageTransitionToken;
	lightboxImage.classList.add('is-fading');
	lightboxImageTransitionTimeout = window.setTimeout(() => {
		if (transitionToken !== lightboxImageTransitionToken) {
			return;
		}

		applyGalleryItemToLightbox(item, normalizedIndex);
		window.requestAnimationFrame(() => {
			if (transitionToken !== lightboxImageTransitionToken) {
				return;
			}

			lightboxImage.classList.remove('is-fading');
		});
	}, lightboxImageFadeDuration);
}

function openLightbox(index) {
	window.clearTimeout(closeLightboxTimeout);
	showGalleryItem(index, { animate: false });
	lightbox.classList.add('is-visible');
	lightbox.setAttribute('aria-hidden', 'false');
	document.body.classList.add('lightbox-open');
	startLightboxAutoAdvance();
}

function showPreviousItem() {
	if (activeGalleryIndex === -1) {
		return;
	}

	showGalleryItem(activeGalleryIndex - 1);
}

function showNextItem() {
	if (activeGalleryIndex === -1) {
		return;
	}

	showGalleryItem(activeGalleryIndex + 1);
}

if (lightbox && lightboxImage && lightboxThumbnails && lightboxCaption && lightboxPosition && lightboxLink && previousControl && nextControl && galleryItems.length > 0) {
	// Only do this if the lightbox markup is on the page.
	buildThumbnailGallery();

	portfolioLinks.forEach((link, index) => {
		link.addEventListener('click', (event) => {
			if (!galleryItems[index] || !galleryItems[index].image) {
				return;
			}

			event.preventDefault();
			openLightbox(index);
		});
	});

	closeControls.forEach((control) => {
		control.addEventListener('click', closeLightbox);
	});

	previousControl.addEventListener('click', showPreviousItem);
	nextControl.addEventListener('click', showNextItem);

	lightboxImage.addEventListener('mouseenter', () => {
		isLightboxImageHovered = true;
		stopLightboxAutoAdvance();
	});

	lightboxImage.addEventListener('mouseleave', () => {
		isLightboxImageHovered = false;
		startLightboxAutoAdvance();
	});

	lightboxThumbnails.addEventListener('mouseenter', () => {
		isLightboxImageHovered = true;
		stopLightboxAutoAdvance();
	});

	lightboxThumbnails.addEventListener('mouseleave', () => {
		isLightboxImageHovered = false;
		startLightboxAutoAdvance();
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && lightbox.classList.contains('is-visible')) {
			closeLightbox();
		}

		if (event.key === 'ArrowLeft' && lightbox.classList.contains('is-visible')) {
			showPreviousItem();
		}

		if (event.key === 'ArrowRight' && lightbox.classList.contains('is-visible')) {
			showNextItem();
		}
	});
}

function easeInOutCubic(t) {
	if (t < 0.5) {
		return 4 * t * t * t;
	}

	return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(targetY, duration) {
	const startY = window.scrollY;
	const distance = targetY - startY;
	const startTime = performance.now();

	function step(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const eased = easeInOutCubic(progress);
		window.scrollTo(0, startY + distance * eased);

		if (progress < 1) {
			window.requestAnimationFrame(step);
		}
	}

	window.requestAnimationFrame(step);
}

// Make the scroll smooth when clicking on navbar links
if (navbarLinks.length > 0) {
	navbarLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}

			const href = link.getAttribute('href');
			if (!href || !href.startsWith('#')) {
				return;
			}

			const targetSection = document.querySelector(href);
			if (!targetSection) {
				return;
			}

			event.preventDefault();

			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const targetY = targetSection.getBoundingClientRect().top + window.scrollY;

			if (prefersReducedMotion) {
				window.scrollTo(0, targetY);
				return;
			}

			animateScrollTo(targetY, navbarScrollDuration);
		});
	});
}

// Gets the contact form element to start validation.
const contactForm = document.getElementById('contact-form');

// Run validation when the contact form is on the page.
if (contactForm) {
	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');
	const messageInput = document.getElementById('message');
	// This area displays a general error when submit is attempted with invalid fields.
	const formSummaryError = document.getElementById('contact-form-error');
	// Define validation rules in one place to avoid duplicated checks.
	const fieldRules = [
		{
			// Rule for name field.
			input: nameInput,
			errorId: 'name-error',
			message: 'Please enter your name.'
		},
		{
			// Rule for email field.
			input: emailInput,
			errorId: 'email-error',
			message: 'Please enter your email address.'
		},
		{
			// Rule for message field.
			input: messageInput,
			errorId: 'message-error',
			message: 'Please enter your message.'
		}
	];

	// Find the error <p> element tied to a specific field.
	function getErrorElement(errorId) {
		return document.getElementById(errorId);
	}

	// Shows the error message and graphics.
	function setFieldError(input, errorElement, message) {
		// If elements are missing, do nothing.
		if (!input || !errorElement) {
			return;
		}

		// Visual highlight for invalid field.
		input.classList.add('field-invalid');
		// Accessibility flag so assistive tech knows field is invalid.
		input.setAttribute('aria-invalid', 'true');
		// Human-readable error message.
		errorElement.textContent = message;
	}

	// Remove invalid messages and visuals.
	function clearFieldError(input, errorElement) {
		// Iif elements are missing, do nothing.
		if (!input || !errorElement) {
			return;
		}

		// Remove visual invalid style.
		input.classList.remove('field-invalid');
		// Indicates current value is acceptable for accessibility.
		input.setAttribute('aria-invalid', 'false');
		// Remove text once field is valid.
		errorElement.textContent = '';
	}

	// Basic email pattern: text@text.domain 
	function isEmailValid(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	// Validate one field rule and return true/false.
	function validateField(rule) {
		// Missing input means skip this rule without blocking form submission.
		if (!rule.input) {
			return true;
		}

		// Locate this field's error output and read trimmed user input.
		const errorElement = getErrorElement(rule.errorId);
		const value = rule.input.value.trim();

		// Check for required value.
		if (!value) {
			setFieldError(rule.input, errorElement, rule.message);
			return false;
		}

		// Extra check for email format only on the email field.
		if (rule.input.id === 'email' && !isEmailValid(value)) {
			setFieldError(rule.input, errorElement, 'Please enter a valid email address (example: name@email.com).');
			return false;
		}

		// If here, this field is valid.
		clearFieldError(rule.input, errorElement);
		return true;
	}

	// Attach live validation behavior to each field.
	fieldRules.forEach((rule) => {
		// Skip if a field was not found.
		if (!rule.input) {
			return;
		}

		// Validate when user leaves the field.
		rule.input.addEventListener('blur', () => {
			validateField(rule);
		});

		// While typing, re-validate only if an error is currently shown.
		rule.input.addEventListener('input', () => {
			const errorElement = getErrorElement(rule.errorId);
			// Avoid unnecessary validation when no error is visible yet.
			if (!errorElement || !errorElement.textContent) {
				return;
			}

			validateField(rule);
		});
	});

	// Validate all fields before submit and block submit if any fail.
	contactForm.addEventListener('submit', (event) => {
		// every(...) returns true only if every field validates successfully.
		const allFieldsValid = fieldRules.every((rule) => validateField(rule));

		// If any field is invalid, prevent form submission.
		if (!allFieldsValid) {
			event.preventDefault();
			// Show a summary message near the submit button.
			if (formSummaryError) {
				formSummaryError.textContent = 'Please correct the highlighted fields before submitting.';
			}

			// Move focus to first invalid field for faster correction.
			const firstInvalidRule = fieldRules.find((rule) => rule.input && rule.input.classList.contains('field-invalid'));
			if (firstInvalidRule && firstInvalidRule.input) {
				firstInvalidRule.input.focus();
			}
			// Exit early because submission is blocked.
			return;
		}

		// Clear summary error when everything is valid and submit is allowed.
		if (formSummaryError) {
			formSummaryError.textContent = '';
		}
	});
}
