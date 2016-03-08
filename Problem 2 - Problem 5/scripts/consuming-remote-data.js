$(document).ready(function() {
    var baseUrl = 'https://baas.kinvey.com/appdata/',
        appId = 'kid_byKIr7imy-',
        token = 'Rakia:Vodka',
        restAPI = btoa(token),
        collectionName = 'Books',
        createBook,
        removeBook,
        editBook;

    loadBooks();

    function loadBooks() {
        $.ajax({
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + restAPI,
                'X-Kinvey-API-Version': '3'
            },
            url: baseUrl + appId + '/' + collectionName + '/',
            success: booksLoaded,
            error: error
        });
    }

    function booksLoaded(data) {
        var tbody = $('#tbody-books'),
            index,
            bookTitle,
            bookAuthor,
            bookIsbn,
            bookId;

        for (index in data) {
            var tr = $('<tr>');

            bookTitle = data[index].title;
            bookAuthor = data[index].author;
            bookIsbn = data[index].isbn;
            bookId = data[index]._id;
            sessionStorage[bookTitle] = bookId;

            tr.append('<td>' + bookTitle + '</td><td>' + bookAuthor + '</td><td>' + bookIsbn + '</td>');
            tr.appendTo(tbody);
        }
    }

    function error() {
        alert('Cannot load AJAX data.');
    }

    function reload() {
        location.reload();
    }

    createBook = $('#create-book').on('click', function addABook() {
        var bookTitle = $('#book-title').val(),
            bookAuthor = $('#book-author').val(),
            bookIsbn = $('#book-isbn').val();

        $.ajax({
            method: 'POST',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3',
                'Content-Type' : 'application/json'
            },
            data: JSON.stringify({
                "title": bookTitle,
                "author": bookAuthor,
                "isbn": bookIsbn
            }),
            url: baseUrl + appId + '/' + collectionName + '/',
            success: reload,
            error: error
        });
    });

    editBook = $('#edit-book').on('click', function editABook() {
        var bookTitle = $('#book-title').val(),
            bookAuthor = $('#book-author').val(),
            bookIsbn = $('#book-isbn').val(),
            newBookAuthor,
            newBookIsbn;

        newBookAuthor = prompt('Change of name of the author: ', bookAuthor) || bookAuthor;
        newBookIsbn = prompt('Change of isbn number of the book: ', bookIsbn) || bookIsbn;

        $.ajax({
            method: 'PUT',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3',
                'Content-Type' : 'application/json'
            },
            data: JSON.stringify({
                "title": bookTitle,
                "author": newBookAuthor,
                "isbn": newBookIsbn
            }),
            url: baseUrl + appId + '/' + collectionName + '/' + sessionStorage[bookTitle],
            success: reload,
            error: error
        })
    });

    removeBook = $('#delete-book').on('click', function removeABook() {
        var bookTitle = $('#book-title').val(),
            bookAuthor = $('#book-author').val(),
            bookIsbn = $('#book-isbn').val();

        $.ajax({
            method: 'DELETE',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            url: baseUrl + appId + '/' + collectionName + '/?query={"title":"' + bookTitle + '"}',
            success: reload,
            error: error
        });
    });
});