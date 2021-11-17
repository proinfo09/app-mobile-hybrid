var ERROR = 'ERROR';

// Create or Open Database.
var db = window.openDatabase('FGW', '1.0', 'FGW', 20000);

// To detect whether users use mobile phones horizontally or vertically.
$(window).on('orientationchange', onOrientationChange);
$(window).on('batterystatus', onBatteryStatus);
$(window).on('batterylow', onBatteryLow);
$(window).on('batterycritical', onBatteryCritical);

function onBatteryStatus(status) {
    alert(`Level: ${status.level}%. isPlugged: ${status.isPlugged}.`);
}

function onBatteryLow(status) {
    alert(`Battery Level Low ${status.level}%.`);
}

function onBatteryCritical(status) {
    alert(`Battery Level Critical ${status.level}%. Recharge Soon!`);
}
// Display messages in the console.
function log(message, type = 'INFO') {
    console.log(`${new Date()} [${type}] ${message}`);
}

function transactionSuccessForTable(tableName) {
    log(`Create table '${tableName}' successfully.`);
}

function transactionSuccessForTableData(tableName, id, name) {
    log(`Insert (${id}, "${name}") into '${tableName}' successfully.`);
}


function onOrientationChange(e) {
    if (e.orientation == 'portrait') {
        log('Portrait.');
    }
    else {
        log('Landscape.');
    }
}

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    $(document).on('deviceready', onDeviceReady);
}
else {
    $(document).on('ready', onDeviceReady);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
    log(`SQL Error ${error.code}. Message: ${error.message}.`, ERROR);
}

// Run this function after starting the application.
function onDeviceReady() {
    log(`Device is ready.`);

    db.transaction(function (tx) {
        // Create table Apartment.
        var query = `CREATE TABLE IF NOT EXISTS Apartment (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         ApartmentName TEXT NOT NULL,
                                                         Address TEXT NOT NULL,
                                                         CityId INTEGER NOT NULL,
                                                         DistrictId INTEGER NOT NULL,
                                                         WardId INTEGER NOT NULL,
                                                         TypeId INTEGER NOT NULL,
                                                         Bedroom INTEGER NOT NULL,
                                                         DateAdded DATETIME NOT NULL,
                                                         Price INTEGER NOT NULL,
                                                         FurnitureId INTERGER NOT NULL,
                                                         Note TEXT,
                                                         UserName TEXT NOT NULL,
                                                         FOREIGN KEY (TypeId) REFERENCES Types(Id),
                                                         FOREIGN KEY (FurnitureId) REFERENCES Furniture(Id),
                                                         FOREIGN KEY (CityId) REFERENCES City(Id),
                                                         FOREIGN KEY (DistrictId) REFERENCES District(Id),
                                                         FOREIGN KEY (WardId) REFERENCES Ward(Id))`;
        tx.executeSql(query, [], function (tx, result) {
            log(`Create table 'Apartment' successfully.`);
        }, transactionError);

        // Create table Account.
        var query = `CREATE TABLE IF NOT EXISTS Account (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Username TEXT NOT NULL UNIQUE,
                                                         Password TEXT NOT NULL`;
        tx.executeSql(query, [], function (tx, result) {
            log(`Create table 'Account' successfully.`);
        }, transactionError);

        // Create table COMMENT.
        var query = `CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Comment TEXT NOT NULL,
                                                         Datetime DATE NOT NULL,
                                                         ApartmentId INTEGER NOT NULL,
                                                         FOREIGN KEY (ApartmentId) REFERENCES Apartment(Id))`;
        tx.executeSql(query, [], function (tx, result) {
            log(`Create table 'Comment' successfully.`);
        }, transactionError);

        // Create table TYPE.
        var query = `CREATE TABLE IF NOT EXISTS Type (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Name TEXT NOT NULL UNIQUE,
                                                         Description TEXT NOT NULL)`;
        tx.executeSql(query, [], function (tx, result) {
            if (result.rows[0] == null)
                addType();
        }, transactionError);

        // Create table Furniture.
        var query = `CREATE TABLE IF NOT EXISTS Furniture (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Name TEXT NOT NULL UNIQUE,
                                                         Description TEXT NOT NULL)`;
        tx.executeSql(query, [], function (tx, result) {
            if (result.rows[0] == null)
                addFurniture();
        }, transactionError);
    });

    prepareDatabase(db);
}

function addType() {
    db.transaction(function (tx) {
        var query = "INSERT INTO Type (Name, Description) VALUES (?, ?)";

        tx.executeSql(query, ['Studio', 'A one-room apartment that comes with a kitchen and a full-size bathroom.'],
            transactionSuccessForTableData('Type', 1, 'Studio', 'A one-room apartment that comes with a kitchen and a full-size bathroom.'), transactionError);
        tx.executeSql(query, ['Loft', 'One large room with high ceilings.'],
            transactionSuccessForTableData('Type', 2, 'Loft', 'One large room with high ceilings.'), transactionError);
        tx.executeSql(query, ['Junior 1 Bedroom', 'This is a slight step up from a studio and usually includes a separate sleeping room or 3/4 room.'],
            transactionSuccessForTableData('Type', 3, 'Junior 1 Bedroom', 'This is a slight step up from a studio and usually includes a separate sleeping room or 3/4 room.'), transactionError);
    });
}

function addFurniture() {
    db.transaction(function (tx) {
        var query = "INSERT INTO Furniture (Name, Description) VALUES (?, ?)";

        tx.executeSql(query, ['None', ''],
            transactionSuccessForTableData('Furniture', 1, 'None', ''), transactionError);
        tx.executeSql(query, ['Luxury interior', 'Luxury interior design is a creative process led by experienced interior designers.'],
            transactionSuccessForTableData('Furniture', 2, 'Luxury interior', 'Luxury interior design is a creative process led by experienced interior designers.'), transactionError);
        tx.executeSql(query, ['Fully furnished', 'A furnished room or house is available to be rented together with the furniture in it.'],
            transactionSuccessForTableData('Furniture', 3, 'Fully furnished', 'A furnished room or house is available to be rented together with the furniture in it.'), transactionError);
        tx.executeSql(query, ['Unfurnished', 'There is no one or no pieces of furniture found in this room.'],
            transactionSuccessForTableData('Furniture', 4, 'Emty', 'There is no one or no pieces of furniture found in this room.'), transactionError);
        tx.executeSql(query, ['Part Furnished', ' the property would contain the basics i.e. beds, sofa, table and chairs, wardrobes.'],
            transactionSuccessForTableData('Furniture', 5, 'Part Furnished', ' the property would contain the basics i.e. beds, sofa, table and chairs, wardrobes.'), transactionError);
    });
}

$(document).on('pagebeforeshow', '#page-create', function () {
    importCity('#page-create #frm-register');
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
    importType('#page-create #frm-register');
    importDateAdded('#page-create #frm-register');
    importFurniture('#page-create #frm-register');
});

$(document).on('load', 'page-create', function () {
    importDateAdded('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #city', function () {
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #district', function () {
    importWard('#page-create #frm-register');
});

$(document).on('vclick', '#page-home #panel-open', function(e) {
    e.preventDefault();
    $('#page-home #mypanel').panel('open');
});

$(document).on('vclick', '#page-create #panel-open', function(e) {
    e.preventDefault();
    $('#page-create #mypanel').panel('open');
});

$(document).on('vclick', '#page-list #panel-open', function(e) {
    e.preventDefault();
    $('#page-list #mypanel').panel('open');
});

$(document).on('vclick', '#page-detail #panel-open', function(e) {
    e.preventDefault();
    $('#page-detail #mypanel').panel('open');
});

$(document).on('vclick', '#page-search #panel-open', function(e) {
    e.preventDefault();
    $('#page-search #mypanel').panel('open');
});

function importCity(form, selectedId = -1) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM City ORDER BY Name';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>Select City</option>`;
            for (let item of result.rows) {
                optionList += `<option value='${item.Id}' ${item.Id == selectedId ? 'selected' : ''}>${item.Name}</option>`;
            }
            $(form + ' #city').html(optionList);
            $(form + ' #city').selectmenu('refresh', true);
        }
    });
}

function importDistrict(form, selectedId = -1, cityId) {
    //var cityName = $('#page-create #frm-register #city option:selected').text();
    if (cityId == null) {
        cityId = $(form + ' #city').val();
    }
    db.transaction(function (tx) {

        var query = 'SELECT * FROM District WHERE CityId = ? ORDER BY Name';
        tx.executeSql(query, [cityId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>Select District</option>`;
            for (let item of result.rows) {
                optionList += `<option value='${item.Id}' ${item.Id == selectedId ? 'selected' : ''}>${item.Name}</option>`;
            }
            $(form + ' #district').html(optionList);
            $(form + ' #district').selectmenu('refresh', true);
        }
    });
}

function importWard(form, selectedId = -1, districtId) {
    //var districtName = $('#page-create #frm-register #district option:selected').text();
    if (districtId == null) {
        districtId = $(form + ' #district').val();
    }
    db.transaction(function (tx) {

        var query = 'SELECT * FROM Ward WHERE DistrictId = ? ORDER BY Name';
        tx.executeSql(query, [districtId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>Select Ward</option>`;
            for (let item of result.rows) {
                optionList += `<option value='${item.Id}' ${item.Id == selectedId ? 'selected' : ''}>${item.Name}</option>`;
            }
            $(form + ' #ward').html(optionList);
            $(form + ' #ward').selectmenu('refresh', true);
        }
    });
}

function importType(form, selectedId = -1) {
    //var typeName = $('#page-create #frm-register #type option:selected').text();
    //var typeId = $('#page-create #frm-register #type').val();
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Type ORDER BY Name';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>Select Type</option>`;
            for (let item of result.rows) {
                optionList += `<option value='${item.Id}' ${item.Id == selectedId ? 'selected' : ''}>${item.Name}</option>`;
            }
            $(form + ' #type').html(optionList);
            $(form + ' #type').selectmenu('refresh', true);
        }
    });
}

function importDateAdded() {
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    h = n.getHours();
    min = n.getMinutes();
    s = n.getSeconds();
    result = m + "/" + d + "/" + y + " @ " + h + ":" + min + ":" + s;
    return result;
}

function importFurniture(form, selectedId = -1) {
    //var furnitureName = $('#page-create #frm-register #furniture option:selected').text();
    //var furnitureId = $('#page-create #frm-register #furniture').val();
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Furniture ORDER BY Name';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value='-1'>Select Furniture</option>`;
            for (let item of result.rows) {
                optionList += `<option value='${item.Id}' ${item.Id == selectedId ? 'selected' : ''}>${item.Name}</option>`;
            }
            $(form + ' #furniture').html(optionList);
            $(form + ' #furniture').selectmenu('refresh', true);
        }
    });
}

// Submit a form to register a new apartment.
$(document).on('submit', '#page-create #frm-register', confirmApartment);
$(document).on('submit', '#page-create #frm-confirm', registerApartment);

function confirmApartment(e) {
    e.preventDefault();


    var cityName = $('#page-create #frm-register #city option:selected').text();
    var cityId = $('#page-create #frm-register #city option:selected').val();
    var districtName = $('#page-create #frm-register #district option:selected').text();
    var districtId = $('#page-create #frm-register #district option:selected').val();
    var wardName = $('#page-create #frm-register #ward option:selected').text();
    var wardId = $('#page-create #frm-register #ward option:selected').val();
    var address = $('#page-create #frm-register #address').val();
    // Get user's input.
    var apartmentname = $('#page-create #frm-register #apartmentname').val();
    var _address = address + ', ' + wardName + ', ' + districtName + ', ' + cityName;
    var type = $('#page-create #frm-register #type option:selected').text();
    var bedroom = $('#page-create #frm-register #bedroom').val();
    var price = $('#page-create #frm-register #price').val();
    var furniture = $('#page-create #frm-register #furniture option:selected').text();
    var note = $('#page-create #frm-register #note').val();
    var username = $('#page-create #frm-register #username').val();
    checkApartment(apartmentname, _address, type, bedroom, price, furniture, note, username);

}

function checkApartment(apartmentname, _address, type, bedroom, price, furniture, note, username) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Apartment WHERE ApartmentName = ? AND Address = ?';
        tx.executeSql(query, [apartmentname, _address], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            if (result.rows[0] == null) {
                log('Open the confirmation popup.');

                $('#page-create #error').empty();
                $('#page-create #frm-confirm #apartmentname').val(apartmentname);
                $('#page-create #frm-confirm #address').val(_address);
                $('#page-create #frm-confirm #type').val(type);
                $('#page-create #frm-confirm #bedroom').val(bedroom);
                $('#page-create #frm-confirm #dateadded').val(importDateAdded());
                $('#page-create #frm-confirm #price').val(price);
                $('#page-create #frm-confirm #furniture').val(furniture);
                $('#page-create #frm-confirm #note').val(note);
                $('#page-create #frm-confirm #username').val(username);

                $('#page-create #frm-confirm').popup('open');
            }
            else {
                var error = 'Apartment exists.';
                $('#page-create #error').empty().append(error);
                log(error, ERROR);
            }
        }
    });
}

function registerApartment(e) {
    e.preventDefault();

    var apartmentname = $('#page-create #frm-confirm #apartmentname').val();
    var address = $('#page-create #frm-register #address').val();
    var cityId = $('#page-create #frm-register #city option:selected').val();
    var districtId = $('#page-create #frm-register #district option:selected').val();
    var wardId = $('#page-create #frm-register #ward option:selected').val();
    var type = $('#page-create #frm-register #type').val();
    var bedroom = $('#page-create #frm-confirm #bedroom').val();
    var dateadded = $('#page-create #frm-confirm #dateadded').val();
    var price = $('#page-create #frm-confirm #price').val();
    var furniture = $('#page-create #frm-register #furniture').val();
    var note = $('#page-create #frm-confirm #note').val();
    var username = $('#page-create #frm-confirm #username').val();

    if (furniture == -1) {
        furniture = 1;
    }

    db.transaction(function (tx) {
        var query = 'INSERT INTO Apartment (ApartmentName , Address, CityId, DistrictId, WardId, TypeId, Bedroom, DateAdded, Price, FurnitureId, Note, UserName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        tx.executeSql(query, [apartmentname, address, cityId, districtId, wardId, type, bedroom, dateadded, price, furniture, note, username], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Create a Apartment '${apartmentname}' successfully.`);
            alert(`Create a Apartment '${apartmentname}' successfully.`);
            // Reset the form.
            $('#frm-register').trigger('reset');
            $('#page-create #error').empty();
            $('#apartmentname').focus();

            $('#page-create #frm-confirm').popup('close');
        }
    });
}

// Display Apartment List.
$(document).on('pagebeforeshow', '#page-list', showList);

function showList() {
    db.transaction(function (tx) {
        var query = `SELECT Apartment.Id, Apartment.ApartmentName, Apartment.Bedroom, Type.Name FROM Apartment INNER JOIN Type ON Apartment.TypeId = Type.Id`;
        //var query = 'SELECT Id, ApartmentName, Address, TypeId FROM Apartment;';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            if (result.rows[0] != null) {
                log(`Get list of apartments successfully.`);
                // Prepare the list of apartments.
                var listApartment = `<ul id='list-apartment' data-role='listview' data-filter='true' data-filter-placeholder='Search apartments...'
                                                     data-corners='false' class='ui-nodisc-icon ui-alt-icon'>`;
                for (let apartment of result.rows) {
                    listApartment += `<li><a data-details='{"Id" : ${apartment.Id}}'>
                                    <img src='img/apartment-building-business-logo-design.jpg' height="100%" style="margin-top: 10px;">
                                    <h3>Apartment: ${apartment.ApartmentName}</h3>
                                    <p>Type: ${apartment.Name}</p>
                                    <p>Bedrooms: ${apartment.Bedroom}</p>
                                </a></li>`;
                }
                listApartment += `</ul>`;
            }
            else {
                log(`Fail to get list of apartments.`);
                var listApartment = `<ul id='list-apartment' data-role='listview' data-filter='true' data-filter-placeholder='Search apartments...'
                                                     data-corners='false' class='ui-nodisc-icon ui-alt-icon'>
                                    <h1 style="justify-content: center; display: flex; color: #827e7e;">No Apartment</h1>`;

                listApartment += `</ul>`;
            }
            // Add list to UI.
            $('#list-apartment').empty().append(listApartment).listview('refresh').trigger('create');

            log(`Show list of apartments successfully.`);
        }
    });
}

// Save Apartment Id.
$(document).on('vclick', '#list-apartment li a', function (e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('currentApartmentId', id);

    $.mobile.navigate('#page-detail', { transition: 'none' });
});

// Show Apartment Details.
$(document).on('pagebeforeshow', '#page-detail', showDetail);

function showDetail() {
    var id = localStorage.getItem('currentApartmentId');
    db.transaction(function (tx) {
        var query = `SELECT Apartment.Id, 
                        Apartment.ApartmentName, 
                        Apartment.Address,
                        City.Name AS 'City',
                        District.Name AS 'District', 
                        Ward.Name AS 'Ward', 
                        Type.Name AS 'TypeName',
                        Apartment.Bedroom,
                        Apartment.DateAdded,
                        Apartment.Price,
                        Furniture.Name AS 'FurnitureName',
                        Apartment.Note,
                        UserName
                    FROM Apartment 
                    JOIN Type 
                    ON Apartment.TypeId = Type.Id
                    JOIN Furniture 
                    ON Apartment.FurnitureId = Furniture.Id
                    JOIN City
                    ON Apartment.CityId = City.Id
                    JOIN District
                    ON Apartment.DistrictId = District.Id
                    JOIN Ward
                    ON Apartment.WardId = Ward.Id                    
                    WHERE Apartment.Id = ?`;
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var errorMessage = 'Apartment not found.';
            var apartmentname = errorMessage;
            var address = errorMessage;
            var city = errorMessage;
            var district = errorMessage;
            var ward = errorMessage;
            var type = errorMessage;
            var bedroom = errorMessage;
            var dateadded = errorMessage;
            var price = errorMessage;
            var furniture = errorMessage;
            var note = errorMessage;
            var username = errorMessage;

            if (result.rows[0] != null) {
                log(`Get details of apartment '${id}' successfully.`);
                apartmentname = result.rows[0].ApartmentName;
                address = result.rows[0].Address;
                city = result.rows[0].City;
                district = result.rows[0].District;
                ward = result.rows[0].Ward;
                type = result.rows[0].TypeName;
                bedroom = result.rows[0].Bedroom;
                dateadded = result.rows[0].DateAdded;
                price = result.rows[0].Price;
                furniture = result.rows[0].FurnitureName;
                note = result.rows[0].Note;
                username = result.rows[0].UserName;
            }
            else {
                log(errorMessage, ERROR);

                $('#page-detail #btn-update').addClass('ui-disabled');
                $('#page-detail #btn-delete-confirm').addClass('ui-disabled');
            }
            var _address = address + ", " + ward + ", " + district + ", " + city;


            $('#page-detail #id').val(id);
            $('#page-detail #apartmentname').val(apartmentname);
            $('#page-detail #address').val(_address);
            $('#page-detail #type').val(type);
            $('#page-detail #bedroom').val(bedroom);
            $('#page-detail #dateadded').val(dateadded);
            $('#page-detail #price').val(price);
            $('#page-detail #furniture').val(furniture);
            $('#page-detail #note').val(note);
            $('#page-detail #username').val(username);

            showComment();
        }
    });
}

// Delete Apartment.
$(document).on('submit', '#page-detail #frm-delete', deleteApartment);
$(document).on('keyup', '#page-detail #frm-delete #txt-delete', confirmDeleteApartment);

function confirmDeleteApartment() {
    var text = $('#page-detail #frm-delete #txt-delete').val();

    if (text == 'confirm delete') {
        $('#page-detail #frm-delete #btn-delete').removeClass('ui-disabled');
    }
    else {
        $('#page-detail #frm-delete #btn-delete').addClass('ui-disabled');
    }
}

function deleteApartment(e) {
    e.preventDefault();

    var id = localStorage.getItem('currentApartmentId');

    db.transaction(function (tx) {
        var query = 'DELETE FROM Apartment WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Delete Apartment '${id}' successfully.`);
            alert(`Delete Apartment '${id}' successfully.`);

            $('#page-detail #frm-delete').trigger('reset');

            $.mobile.navigate('#page-list', { transition: 'none' });
        }
    });
}

// Update Apartment.
//$(document).on('submit', '#page-detail #frm-update', updateApartment);
$(document).on('submit', '#page-detail #frm-update', confirmUpdateApartment);

function confirmUpdateApartment(e) {
    e.preventDefault();
    var id = localStorage.getItem('currentApartmentId');
    var apartmentname = $('#page-detail #frm-update #apartmentname').val();
    var address = $('#page-detail #frm-update #address').val();
    var city = $('#page-detail #frm-update #city').val();
    var district = $('#page-detail #frm-update #district').val();
    var ward = $('#page-detail #frm-update #ward').val();
    var type = $('#page-detail #frm-update #type').val();
    var bedroom = $('#page-detail #frm-update #bedroom').val();
    var dateadded = $('#page-detail #frm-update #dateadded').val();
    var price = $('#page-detail #frm-update #price').val();
    var furniture = $('#page-detail #frm-update #furniture').val();
    var note = $('#page-detail #frm-update #note').val();
    var username = $('#page-detail #frm-update #username').val();

    if (furniture == -1) {
        furniture = 1;
    }
    db.transaction(function (tx) {
        var query = `UPDATE Apartment
                        SET ApartmentName = ?,
                            Address = ?,
                            CityId = ?,
                            DistrictId = ?,
                            WardId = ?,
                            TypeId = ?,
                            Bedroom = ?,
                            DateAdded = ?,
                            Price = ?,
                            FurnitureId = ?,
                            Note = ?,
                            UserName = ?
                        WHERE Id = ?;`;
        tx.executeSql(query, [apartmentname, address, city, district, ward, type, bedroom, dateadded, price, furniture, note, username, id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Update Apartment '${id}' successfully.`);
            alert(`Update Apartment '${apartmentname}' successfully.`);
            $('#page-detail').trigger('reset');

            $.mobile.navigate('#page-detail', { transition: 'none' });
            window.location.reload();
        }
    });
}

$(document).on('pageshow', '#page-detail', function () {
    db.transaction(function (tx) {
        var id = localStorage.getItem('currentApartmentId');
        var query = `SELECT Address, CityId, DistrictId, WardId, TypeId, FurnitureId FROM Apartment WHERE Id = ?`;
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`GET TypeId '${result.rows[0].TypeId}', '${result.rows[0].DistrictId}', '${result.rows[0].WardId}'  successfully.`);
            importCity('#page-detail #frm-update', result.rows[0].CityId);
            importDistrict('#page-detail #frm-update', result.rows[0].DistrictId, result.rows[0].CityId);
            importWard('#page-detail #frm-update', result.rows[0].WardId, result.rows[0].DistrictId);
            importType('#page-detail #frm-update', result.rows[0].TypeId);
            importFurniture('#page-detail #frm-update', result.rows[0].FurnitureId);
            $('#page-detail #frm-update #address').val(result.rows[0].Address);
            $('#page-detail #frm-update #dateadded').val(importDateAdded());
        }
    });
});

$(document).on('change', '#page-detail #frm-update #city', function () {
    importDistrict('#page-detail #frm-update');
    importWard('#page-detail #frm-update');
});

$(document).on('change', '#page-detail #frm-update #district', function () {
    importWard('#page-detail #frm-update');
});

// Add Comment.
$(document).on('submit', '#page-detail #frm-comment', addComment);

function addComment(e) {
    e.preventDefault();

    var apartmentId = localStorage.getItem('currentApartmentId');
    var comment = $('#page-detail #frm-comment #txt-comment').val();
    var dateTime = new Date();

    db.transaction(function (tx) {
        var query = 'INSERT INTO Comment (ApartmentId, Comment, Datetime) VALUES (?, ?, ?)';
        tx.executeSql(query, [apartmentId, comment, dateTime], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Add new comment to apartment '${apartmentId}' successfully.`);

            $('#page-detail #frm-comment').trigger('reset');

            showComment();
        }
    });
}

// Show Comment.
function showComment() {
    var apartmentId = localStorage.getItem('currentApartmentId');

    db.transaction(function (tx) {
        var query = 'SELECT * FROM Comment WHERE ApartmentId = ?';
        tx.executeSql(query, [apartmentId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Get list of comments successfully.`);

            // Prepare the list of comments.
            var listComment = '';
            for (let comment of result.rows) {
                listComment += `<div class = 'list'>
                                    <small>${comment.Datetime}</small>
                                    <h3>${comment.Comment}</h3>
                                </div>`;
            }

            // Add list to UI.
            $('#list-comment').empty().append(listComment);

            log(`Show list of comments successfully.`);
        }
    });
}


// Search.
$(document).on('pagebeforeshow', '#page-search', function () {
    importCity('#page-search #frm-search');
    importDistrict('#page-search #frm-search');
    importWard('#page-search #frm-search');
    importType('#page-search #frm-search');
    importFurniture('#page-search #frm-search');
});

$(document).on('change', '#page-search #frm-search #city', function () {
    importDistrict('#page-search #frm-search');
    importWard('#page-search #frm-search');
});

$(document).on('change', '#page-search #frm-search #district', function () {
    importWard('#page-search #frm-search');
});


$(document).on('submit', '#page-search #frm-search', search);

function search(e) {
    e.preventDefault();

    var apartmentname = $('#page-search #frm-search #apartmentname').val();
    var address = $('#page-search #frm-search #address').val();
    var city = $('#page-search #frm-search #city ').val();
    var district = $('#page-search #frm-search #district').val();
    var ward = $('#page-search #frm-search #ward').val();
    var type = $('#page-search #frm-search #type').val();
    var bedroom = $('#page-search #frm-search #bedroom').val();
    var price = $('#page-search #frm-search #price').val();
    var furniture = $('#page-search #frm-search #furniture').val();
    var username = $('#page-search #frm-search #username').val();
    log(`city = ${city}`);
    db.transaction(function (tx) {
        var query = `SELECT Apartment.Id, Apartment.ApartmentName, Apartment.Address, Apartment.CityId, Apartment.DistrictId, Apartment.WardId, Apartment.TypeId, 
                        Apartment.FurnitureId, Apartment.Bedroom, Apartment.UserName, Apartment.Price, Type.Name 
                        FROM Apartment
                        JOIN Type
                        ON Type.Id = Apartment.TypeId
                        WHERE`;

        if (username) {
            query += ` Apartment.ApartmentName LIKE "%${apartmentname}%"   AND`;
        }

        if (address) {
            query += ` Apartment.Address LIKE "%${address}%"   AND`;
        }

        if (city && city != -1) {
            query += ` Apartment.CityId = "${city}"   AND`;
        }

        if (district && district != -1) {
            query += ` Apartment.DistrictId = "${district}"   AND`;
        }

        if (ward && ward != -1) {
            query += ` Apartment.WardId = "${ward}"   AND`;
        }

        if (type && type != -1) {
            query += ` Apartment.TypeId = "${type}"   AND`;
        }

        if (furniture && furniture != -1) {
            query += ` Apartment.FurnitureId = "${furniture}"   AND`;
        }

        if (bedroom) {
            query += ` Apartment.Bedroom >= "${bedroom}"   AND`;
        }

        if (price) {
            query += ` Apartment.Price >= "${price}"   AND`;
        }

        if (username) {
            query += ` Apartment.UserName = "%${username}%"   AND`;
        }

        query = query.substring(0, query.length - 6);

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Search list of accounts successfully.`);

            // Prepare the list of accounts.
            var listApartment = `<ul id='list-apartment' data-role='listview' class='ui-nodisc-icon ui-alt-icon'>`;
            for (let apartment of result.rows) {
                listApartment += `<li><a data-details='{"Id" : ${apartment.Id}}'>
                                    <img src='img/apartment-building-business-logo-design.jpg' height="100%" style="margin-top: 10px;">
                                    <h3>Apartment: ${apartment.ApartmentName}</h3>
                                    <p>Type: ${apartment.Name}</p>
                                    <p>Bedrooms: ${apartment.Bedroom}</p>
                                    </a></li>`;
            }
            listApartment += `</ul>`;

            // Add list to UI.                                    
            $('#page-search #list-apartment').empty().append(listApartment).trigger('create');

            log(`Show list of Apartment successfully.`);
        }
    });
}

// CAMERA
// https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-camera/index.html

// Installation:
// cordova plugin add cordova-plugin-camera

$(document).on('vclick', '#btn-take-picture', takePicture);

function takePicture() {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: true
    }

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        alert(imageData);

        $('#img-01').attr('src', `data:image/jpeg;base64,${imageData}`);
    }

    function error(error) {
        alert(`Failed to take picture. Error: ${error}.`);
    }
}