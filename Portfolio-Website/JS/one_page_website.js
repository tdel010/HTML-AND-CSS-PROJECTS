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
	activeGalleryIndex = -1;
	lightbox.classList.remove('is-visible');
	lightbox.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('lightbox-open');
	closeLightboxTimeout = window.setTimeout(() => {
		lightboxImage.src = '';
		lightboxImage.alt = '';
		lightboxCaption.textContent = '';
		lightboxPosition.textContent = '';
		lightboxLink.href = '#';
		updateActiveThumbnail();
	}, lightboxTransitionDuration);
}

// Wrap the index so the gallery loops.
function showGalleryItem(index) {
	const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
	const item = galleryItems[normalizedIndex];

	if (!item || !item.image) {
		return;
	}

	activeGalleryIndex = normalizedIndex;
	lightboxImage.src = item.image.src;
	lightboxImage.alt = item.image.alt;
	lightboxCaption.textContent = item.caption;
	lightboxPosition.textContent = 'Image ' + (normalizedIndex + 1) + ' of ' + galleryItems.length;
	lightboxLink.href = item.url;
	updateActiveThumbnail();
}

function openLightbox(index) {
	window.clearTimeout(closeLightboxTimeout);
	showGalleryItem(index);
	lightbox.classList.add('is-visible');
	lightbox.setAttribute('aria-hidden', 'false');
	document.body.classList.add('lightbox-open');
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
