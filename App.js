"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function LikeButton() {
  var _React$useState = React.useState({
    loading: true,
    second_part_loaded: false
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var token = "ef448cc94b9a88715488a22a370c84ec240125ad";
  var query = "";
  var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
  var options = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token
    }
  };

  var _React$useState3 = React.useState(""),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      txt = _React$useState4[0],
      setTxt = _React$useState4[1];

  var onInputChange = function onInputChange(e) {
    var value = e.target.value;
    //console.log('Input value: ', value);

    var re = /^[A-Za-zА-Яа-я]+$/;
    if (value === "" || re.test(value)) {
      setTxt(value);
    }
  };

  var handleClick = function handleClick(e) {
    e.preventDefault();

    var query = state.town + " " + txt;

    console.log(query);
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?ip=";
    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token
      },
      body: JSON.stringify({ query: query })
    };

    fetch(url, options).then(function (response) {
      return response.text();
    }).then(function (result) {
      setState({
        loading: false,
        town: state.town,
        ip: result.ip,
        second_part_loaded: true,
        list_of_streets: JSON.parse(result).suggestions.map(function (num, index) {
          return React.createElement(
            "option",
            { key: index, value: num.value },
            num.value
          );
        })
      });
      console.log(JSON.parse(result).suggestions);
      console.log("tst3");
      console.log(state);
    }).catch(function (error) {
      return console.log("error", error);
    });
  };

  if (state.loading) {
    fetch("https://api.ipify.org?format=json", { method: "GET" }).then(function (res) {
      return res.json();
    }).then(function (result) {
      //console.log(result)

      setState(Object.assign(state, { ip: result.ip }));
      fetch(url + result.ip, options).then(function (response) {
        return response.text();
      }).then(function (result) {
        setState({
          loading: false,
          town: JSON.parse(result).location.value,
          second_part_loaded: false,
          ip: state.ip
        });
      }).catch(function (error) {
        return console.log("error", error);
      });
    }).catch(function (error) {
      return console.error(error);
    });
  }

  if (state.loading) {
    return "Loading..";
  } else if (!state.second_part_loaded) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        state.town
      ),
      React.createElement(
        "p",
        null,
        state.ip
      ),
      React.createElement(
        "p",
        null,
        "\u0423\u043B\u0438\u0446\u0430:"
      ),
      React.createElement("input", {
        type: "text",
        id: "street",
        className: "form-control",
        placeholder: "Allow only alphabets",
        value: txt,
        onChange: onInputChange
      }),
      React.createElement(
        "button",
        { type: "submit", onClick: handleClick },
        "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C"
      )
    );
  } else if (state.second_part_loaded) {
    console.log(state.list_of_streets);
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        state.town
      ),
      React.createElement(
        "p",
        null,
        state.ip
      ),
      React.createElement(
        "p",
        null,
        "\u0423\u043B\u0438\u0446\u0430:"
      ),
      React.createElement("input", {
        type: "text",
        id: "street",
        className: "form-control",
        placeholder: "Allow only alphabets",
        value: txt,
        onChange: onInputChange
      }),
      React.createElement(
        "button",
        { type: "submit", onClick: handleClick },
        "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C"
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "select",
          { name: "streets" },
          state.list_of_streets,
          ";"
        )
      )
    );
  }
}
var e = React.createElement;
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(e(LikeButton));