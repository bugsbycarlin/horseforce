function save_options() {
  var replacements = document.getElementById('replacements').value;
  chrome.storage.local.set({
    replacements: replacements,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.local.get({
    replacements: 'Force:Horse',
  }, function(items) {
    document.getElementById('replacements').value = items.replacements;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);