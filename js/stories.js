'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();

	const favoriteIcon = User.checkIfStoryIsFavorite(story.storyId)
		? '<span class="fav-indicator-icon">&starf;</span>'
		: '<span class="fav-indicator-icon">&star;</span>';

	return $(`
      <li id="${story.storyId}">
	  ${favoriteIcon}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

/** Handle create story form submission. If create story is ok, puts new story on page */

async function createNewStory(evt) {
	console.debug('createNewStory', evt);
	evt.preventDefault();

	// grab the author, title and url
	const author = $('#story-author').val();
	const title = $('#story-title').val();
	const url = $('#story-url').val();

	const newStory = await StoryList.addStory(currentUser, {
		author,
		title,
		url,
	});

	currentUser.ownStories.push(newStory);

	$createStoryForm.trigger('reset');

	const $story = generateStoryMarkup(newStory);
	$allStoriesList.prepend($story);

	$createStoryForm.hide('ease');
}

$createStoryForm.on('submit', createNewStory);

/** Handle add/remove favorite stories */

async function toggleFavoriteStatus(evt) {
	console.debug('toggleFavoriteStatus');
	const storyId = evt.target.parentElement.id;

	await User.addRemoveFavoriteStory(currentUser, storyId);
}

/** Show user favorite stories on click on "favorites" */

function showFavorites(evt) {
	console.debug('showFavorites', evt);
	isCurrentlyOnMyStories = false;
	hidePageComponents();

	if (currentUser.favorites.length === 0) {
		$noStoriesMsg.show();
	} else {
		$allStoriesList.empty();

		currentUser.favorites.forEach((story) => {
			const $story = generateStoryMarkup(story);
			$allStoriesList.append($story);
		});

		$allStoriesList.show();
	}
}

$navFavories.on('click', showFavorites);

/** Show user stories on click on "my stories" */

function showUserStories(evt) {
	console.debug('showUserStories', evt);
	isCurrentlyOnMyStories = true;
	hidePageComponents();

	if (currentUser.ownStories.length === 0) {
		$noMyStoriesMsg.show();
	} else {
		$allStoriesList.empty();

		currentUser.ownStories.forEach((story) => {
			const $story = generateStoryMarkup(story);
			$story.prepend(
				'<span class="fas fa-trash-alt delete-story"></span>'
			);
			$allStoriesList.append($story);
		});

		$allStoriesList.show();
	}
}

$navMyStories.on('click', showUserStories);

/** Handle remove user story */

async function deleteStory(evt) {
	const storyId = evt.target.parentElement.id;

	await User.deleteStory(currentUser, storyId);

	currentUser.ownStories = currentUser.ownStories.filter(
		(story) => story.storyId !== storyId
	);

	currentUser.favorites = currentUser.favorites.filter(
		(story) => story.storyId !== storyId
	);

	storyList.stories = storyList.stories.filter(
		(story) => story.storyId !== storyId
	);

	showUserStories(null);
}

$allStoriesList.on('click', (evt) => {
	if (evt.target.className === 'fav-indicator-icon') {
		toggleFavoriteStatus(evt);
	} else if (evt.target.className === 'fas fa-trash-alt delete-story') {
		deleteStory(evt);
	}
});
