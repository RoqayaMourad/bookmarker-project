// Listen for form submit
document.getElementById('myForm').addEventListener('submit', saveBookmark);

// Save Bookmark
function saveBookmark(e){
  // Prevent form from submitting
  e.preventDefault();

  // Get form values
  var siteName =document.getElementById('siteName').value.trim();
  var siteUrl =document.getElementById('siteUrl').value.trim();

  if(!validateForm(siteName, siteUrl)){
    return false;
  }

  var bookmark = {
    name: siteName,
    url: siteUrl
  }

  /*
    // Local Storage Test
    localStorage.setItem('test', 'Hello World');
    console.log(localStorage.getItem('test'));
    localStorage.removeItem('test');
    console.log(localStorage.getItem('test'));
  */

  // Get bookmarks from localStorage (empty array on the first visit)
  var bookmarks = getBookmarks();
  // Add bookmark to array
  bookmarks.push(bookmark);
  // Re-set back to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  // Clear form
  document.getElementById('myForm').reset();

  // Re-fetch bookmarks
  fetchBookmarks();
}

// Get bookmarks from localStorage, or an empty array if nothing usable is saved
function getBookmarks(){
  try {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    return Array.isArray(bookmarks) ? bookmarks : [];
  } catch (error) {
    return [];
  }
}

// Delete bookmark
function deleteBookmark(index){
  // Get bookmarks from localStorage
  var bookmarks = getBookmarks();
  // Remove only the clicked bookmark from array
  bookmarks.splice(index, 1);
  // Re-set back to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  // Re-fetch bookmarks
  fetchBookmarks();
}

// Fetch bookmarks
function fetchBookmarks(){
  // Get bookmarks from localStorage
  var bookmarks = getBookmarks();
  // Get output id
  var bookmarksResults = document.getElementById('bookmarksResults');

  // Build output
  bookmarksResults.innerHTML = '';
  for(var i = 0; i < bookmarks.length; i++){
    bookmarksResults.appendChild(createBookmarkElement(bookmarks[i], i));
  }
}

// Build one bookmark, the name is added as text so HTML characters are shown as typed
function createBookmarkElement(bookmark, index){
  var well = document.createElement('div');
  well.className = 'well';

  var heading = document.createElement('h3');
  heading.appendChild(document.createTextNode(String(bookmark.name) + ' '));

  // Only web addresses get a Visit link
  var validUrl = getValidUrl(String(bookmark.url));
  if(validUrl){
    var visitLink = document.createElement('a');
    visitLink.className = 'btn btn-default';
    visitLink.target = '_blank';
    visitLink.rel = 'noopener noreferrer';
    visitLink.href = validUrl;
    visitLink.textContent = 'Visit';
    heading.appendChild(visitLink);
    heading.appendChild(document.createTextNode('  '));
  }

  var deleteLink = document.createElement('a');
  deleteLink.className = 'btn btn-danger';
  deleteLink.href = '#';
  deleteLink.textContent = 'Delete';
  deleteLink.addEventListener('click', function(e){
    e.preventDefault();
    deleteBookmark(index);
  });
  heading.appendChild(deleteLink);
  heading.appendChild(document.createTextNode(' '));

  well.appendChild(heading);
  return well;
}

// Validate Form
function validateForm(siteName, siteUrl){
  if(!siteName || !siteUrl){
    alert('Please fill in the form');
    return false;
  }

  if(!getValidUrl(siteUrl)){
    alert('Please use a valid URL');
    return false;
  }

  return true;
}

// Return the full http or https address, or null if it is not a valid web address
function getValidUrl(url) {
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
      // Other schemes such as javascript: or data: are not web addresses
      if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(url)) {
          return null;
      }
      // Ordinary addresses without a protocol get http://
      url = "http://" + url;
  }

  var parsed;
  try {
      parsed = new URL(url);
  } catch (error) {
      return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
  }
  // Needs a host name like example.com and no user name or password part
  if (parsed.username || parsed.password || parsed.hostname.indexOf('.') === -1) {
      return null;
  }
  // Host names only use letters, numbers, dots and hyphens
  if (!/^[a-z0-9.-]+$/i.test(parsed.hostname)) {
      return null;
  }
  return parsed.href;
}
