// I copied a lot of this code from
// https://github.com/jffry/force-to-horse
// (It's pretty awesome, I just wanted a more configurable version)
(function()
{
  replacement_list = [];

  chrome.storage.local.get({
    replacements: 'Force:Horse',
  }, function(items) {
    option_list = items.replacements.split("\n");
    for(var i = 0; i < option_list.length; i++)
    {
      replacement_list.push(option_list[i].split(":"));
    }

    var total_replacements = walk_dom(document.body);
    console.log("Replaced %d", total_replacements);
  });

  function walk_dom(node) 
  {
    var child, next;
    var total_replacements = 0;

    switch ( node.nodeType )  
    {
      case 1:  // Element
      case 9:  // Document
      case 11: // Document fragment
        child = node.firstChild;
        while ( child ) 
        {
          next = child.nextSibling;
          total_replacements += walk_dom(child);
          child = next;
        }
        break;
      case 3: // Text node
        if(node.parentElement.tagName.toLowerCase() != "script") {
            total_replacements += make_replacements(node);
        }
        break;
    }

    return total_replacements;
  }

  function make_replacements(textNode)
  {
    var value = textNode.nodeValue;
    var total_replacements = 0;

    for(var i = 0; i < replacement_list.length; i++)
    {
      replacement_item = replacement_list[i];
      target = replacement_item[0];
      replacement = replacement_item[1];

      r = new RegExp(target, "gi");

      if(value.match(r))
      {
        value = value.replace(r, function(match)
        {
          return matchCase(replacement, match);
        });
        total_replacements += 1;
      }
    }

    textNode.nodeValue = value;

    return total_replacements;
  }

  // http://stackoverflow.com/questions/17264639/replace-text-but-keep-case
  function matchCase(text, pattern)
  {
    var result = '';

    for(var i = 0; i < text.length; i++)
    {
      var c = text.charAt(i);
      var p = pattern.charCodeAt(i);

      if(p >= 65 && p < 65 + 26)
      {
        result += c.toUpperCase();
      }
      else
      {
        result += c.toLowerCase();
      }
    }

    return result;
  }
  
})();