document.addEventListener('DOMContentLoaded', () => {
    // BACKEND_INTEGRATION:
    // Replace `mockProfiles` with an initial fetch from an API endpoint.
    // This initial fetch could happen here or be embedded by the backend into the page.
    // Example API: GET /api/profiles_to_swipe?limit=10
    // The API should return a JSON array of profile objects. Each object should include:
    // - id (unique user ID for swiping)
    // - name
    // - age
    // - bio
    // - profile_picture_url
    const mockProfiles = [
        { id: 1, name: 'Alex', age: 28, bio: 'Loves hiking and dogs. Enjoys quiet evenings and reading.', profile_picture_url: 'static/images/mock_profile1.png' },
        { id: 2, name: 'Jamie', age: 24, bio: 'Art enthusiast, enjoys visiting galleries and trying new cafes.', profile_picture_url: 'static/images/mock_profile2.png' },
        { id: 3, name: 'Chris P.', age: 30, bio: 'Tech enthusiast, gamer, and loves sci-fi movies.', profile_picture_url: 'static/images/default_profile.png' },
        { id: 4, name: 'Taylor', age: 26, bio: 'Musician and songwriter. Plays guitar and piano.', profile_picture_url: 'static/images/mock_profile1.png' }, // Reusing image for now
        { id: 5, name: 'Morgan', age: 29, bio: 'Foodie and traveler. Always looking for the next adventure.', profile_picture_url: 'static/images/mock_profile2.png' } // Reusing image for now
    ];

    let currentProfileIndex = 0;
    let profiles = [...mockProfiles]; // Use a copy to allow for dynamic fetching later

    // TODO: Implement a function to fetch more profiles when `profiles` array is low.
    // async function fetchMoreProfiles() {
    //     // BACKEND_INTEGRATION: Fetch next batch of profiles.
    //     // Example API: GET /api/profiles_to_swipe?limit=10&offset=<current_profiles_length>
    //     // Append new profiles to the `profiles` array.
    //     // If no new profiles, can set a flag to stop trying.
    //     console.log("BACKEND_INTEGRATION: Attempting to fetch more profiles.");
    //     // const response = await fetch('/api/profiles_to_swipe?limit=10&offset=' + profiles.length);
    //     // const newProfiles = await response.json();
    //     // if (newProfiles && newProfiles.length > 0) {
    //     //     profiles.push(...newProfiles);
    //     // } else {
    //     //     console.log("No more new profiles to fetch.");
    //     // }
    // }

    const profileCard = document.getElementById('profileCard');
    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');
    const profileAge = document.getElementById('profileAge');
    const profileBio = document.getElementById('profileBio');
    const noMoreProfilesMessage = document.getElementById('noMoreProfiles');

    const likeButton = document.getElementById('likeButton');
    const nopeButton = document.getElementById('nopeButton');

    function loadProfile(index) {
        // BACKEND_INTEGRATION:
        // Consider fetching more profiles if `index` is getting close to `profiles.length - threshold`.
        // Example: if (profiles.length - index < 5) { fetchMoreProfiles(); }

        if (index >= profiles.length) {
            profileCard.style.display = 'none';
            noMoreProfilesMessage.style.display = 'block';
            likeButton.disabled = true;
            nopeButton.disabled = true;
            console.log("No more profiles in current batch.");
            // fetchMoreProfiles(); // Attempt to fetch more if list is exhausted
            return;
        }

        profileCard.style.display = 'flex'; // Or 'block' depending on your CSS for the card
        noMoreProfilesMessage.style.display = 'none';
        likeButton.disabled = false; // Re-enable buttons if they were disabled
        nopeButton.disabled = false;

        const profile = profiles[index];
        profileImage.src = profile.profile_picture_url;
        profileImage.onerror = () => {
            profileImage.src = "static/images/default_profile.png";
        };
        profileName.textContent = profile.name;
        profileAge.textContent = profile.age;
        profileBio.textContent = profile.bio;

        // Reset animation classes
        profileCard.classList.remove('animate-swipe-left', 'animate-swipe-right');
    }

    function handleSwipe(action) {
        if (currentProfileIndex >= profiles.length) return;

        const user = profiles[currentProfileIndex];
        const animationClass = action === 'like' ? 'animate-swipe-right' : 'animate-swipe-left';

        profileCard.classList.add(animationClass);

        // Wait for animation to finish before loading next card
        setTimeout(() => {
            const swipedUserId = user.id;
            if (action === 'like') {
                console.log(`Liked ${user.name} (ID: ${swipedUserId})`);
                // BACKEND_INTEGRATION: Record like for user.
                // Endpoint: e.g., POST /api/swipe_action
                // Body: { "swiped_user_id": swipedUserId, "action": "like", "swiper_user_id": /* current_user.id from backend session */ }
                // fetch('/api/swipe_action', {
                //     method: 'POST',
                //     headers: {'Content-Type': 'application/json', /* CSRF token if needed */},
                //     body: JSON.stringify({ swiped_user_id: swipedUserId, action: 'like' })
                // }).then(response => response.json()).then(data => console.log('Like recorded:', data));
                console.log(`BACKEND_INTEGRATION: POST /api/swipe_action { swiped_user_id: ${swipedUserId}, action: 'like' }`);
            } else { // 'nope'
                console.log(`Noped ${user.name} (ID: ${swipedUserId})`);
                // BACKEND_INTEGRATION: Record nope for user.
                // Endpoint: e.g., POST /api/swipe_action
                // Body: { "swiped_user_id": swipedUserId, "action": "nope", "swiper_user_id": /* current_user.id */ }
                // fetch('/api/swipe_action', {
                //     method: 'POST',
                //     headers: {'Content-Type': 'application/json', /* CSRF token if needed */},
                //     body: JSON.stringify({ swiped_user_id: swipedUserId, action: 'nope' })
                // }).then(response => response.json()).then(data => console.log('Nope recorded:', data));
                console.log(`BACKEND_INTEGRATION: POST /api/swipe_action { swiped_user_id: ${swipedUserId}, action: 'nope' }`);
            }
            currentProfileIndex++;
            loadProfile(currentProfileIndex);
        }, 500); // Match CSS animation duration
    }

    likeButton.addEventListener('click', () => handleSwipe('like'));
    nopeButton.addEventListener('click', () => handleSwipe('nope'));

    // Load the first profile
    loadProfile(currentProfileIndex);
});
