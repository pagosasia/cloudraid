var spinner = new Spinner( {radius: 8, left: '95%'} );


function xhr(method, path, data, callback) {
  var x = new XMLHttpRequest()
  x.open(method, '/files/' + path, true);
  x.onreadystatechange = function () {
    if (x.readyState == 4) {
      spinner.stop();
      callback(x.responseText);
    }
  };
  if (data) {
    x.setRequestHeader('Content-Type', 'application/octet-stream');
  }
  x.send(data);
}

function deleteFile(filename, version) {
  xhr('DELETE', 'data/' + filename + '/' + version, null, updateFileList);
}

function updateFileList() {
  function ce(tagname) {
    return document.createElement(tagname);
  }

  function createRow(item) {
    var tr = ce('tr');

    var td1 = tr.appendChild(ce('td'));
    td1.innerText = item.filename;

    var td2 = tr.appendChild(ce('td'));
    td2.innerText = item.version;

    var td3 = tr.appendChild(ce('td'));
    td3.innerText = filesize(item.size);

    var td4 = tr.appendChild(ce('td'));
    td4.innerText = moment(item.insertDate).format('D.M.YYYY HH:mm:ss');

    var td5 = tr.appendChild(ce('td'));
    var a1 = td5.appendChild(ce('a'));
    td5.appendChild(document.createTextNode(' '));
    var a2 = td5.appendChild(ce('a'));
    a1.innerText = 'Download';
    a1.href = '/files/data/' + item.filename + '/' + item.version;
    a1.target = '_blank';
    a2.innerText = 'Delete';
    a2.href = '#';
    a2.onclick = function(e) {
      spinner.spin(document.getElementById("listHeader"));
      deleteFile(item.filename, item.version);
      e.preventDefault();
    };
    return tr;
  }

  xhr('GET', 'list', null, function (responseText) {
    var json = JSON.parse(responseText);
    var tbody = document.getElementById('list');
    while (tbody.childNodes.length) {
      tbody.removeChild(tbody.childNodes[0]);
    }

    for (var i = 0; i < json.length; ++i) {
      tbody.appendChild(createRow(json[i]));
    }
  });
}

function fileChange() {
  spinner.spin(document.getElementById("createHeader"));
  var file = document.getElementById('file').files[0];
  xhr('POST', 'data/' + file.name, file, updateFileList);
}

function upload() {
  document.getElementById('form').reset();
  document.getElementById('file').click();
}

window.onload = updateFileList;
