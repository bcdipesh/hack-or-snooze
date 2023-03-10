'use strict';

// global flag to track if user is currently viewing my stories
let isCurrentlyOnMyStories = false;

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $('body');

const $storiesLoadingMsg = $('#stories-loading-msg');
const $noStoriesMsg = $('#no-favorites-msg');
const $noMyStoriesMsg = $('#no-my-stories-msg');
const $allStoriesList = $('#all-stories-list');
const $createStoryForm = $('#create-story-form');

const $loginForm = $('#login-form');
const $signupForm = $('#signup-form');

const $navSubmit = $('#nav-submit');
const $navFavories = $('#nav-favorites');
const $navMyStories = $('#nav-my-stories');
const $navLogin = $('#nav-login');
const $navUserProfile = $('#nav-user-profile');
const $navLogOut = $('#nav-logout');

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
	const components = [
		$allStoriesList,
		$createStoryForm,
		$loginForm,
		$signupForm,
		$noStoriesMsg,
		$noMyStoriesMsg,
	];
	components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
	console.debug('start');

	$navSubmit.hide();
	$navFavories.hide();
	$navMyStories.hide();

	// "Remember logged-in user" and log in, if credentials in localStorage
	await checkForRememberedUser();
	await getAndShowStoriesOnStart();

	// if we got a logged-in user
	if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
	'HEY STUDENT: This program sends many debug messages to' +
		" the console. If you don't see the message 'start' below this, you're not" +
		' seeing those helpful debug messages. In your browser console, click on' +
		" menu 'Default Levels' and add Verbose"
);
$(start);
