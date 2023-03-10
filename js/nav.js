'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	isCurrentlyOnMyStories = false;
	hidePageComponents();
	putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show create story form on click on "submit" */

function navSubmitClick(evt) {
	console.debug('navSubmitClick', evt);
	isCurrentlyOnMyStories = false;
	$createStoryForm.show('ease');
}

$navSubmit.on('click', navSubmitClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navSubmit.show();
	$navFavories.show();
	$navMyStories.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
