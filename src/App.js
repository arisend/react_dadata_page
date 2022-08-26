"use strict";

function LikeButton() {
  const [state, setState] = React.useState({
    loading: true,
    second_part_loaded: false,
  });
  var token = "ef448cc94b9a88715488a22a370c84ec240125ad";
  var query = "";
  let url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
  var options = {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
  };

  const [txt, setTxt] = React.useState("");

  const onInputChange = (e) => {
    const { value } = e.target;
    //console.log('Input value: ', value);

    const re = /^[A-Za-zА-Яа-я]+$/;
    if (value === "" || re.test(value)) {
      setTxt(value);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    var query = state.town + " " + txt;

    console.log(query);
    let url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?ip=";
    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({ query: query }),
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((result) => {
        setState({
          loading: false,
          town: state.town,
          ip: result.ip,
          second_part_loaded: true,
          list_of_streets: JSON.parse(result).suggestions.map((num, index) => (
            <option key={index} value={num.value}>
              {num.value}
            </option>
          )),
        });
        console.log(JSON.parse(result).suggestions);
        console.log("tst3");
        console.log(state);
      })
      .catch((error) => console.log("error", error));
  };

  if (state.loading) {
    fetch("https://api.ipify.org?format=json", { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)

        setState(Object.assign(state, { ip: result.ip }));
        fetch(url + result.ip, options)
          .then((response) => response.text())
          .then((result) => {
            setState({
              loading: false,
              town: JSON.parse(result).location.value,
              second_part_loaded: false,
              ip: state.ip,
            });
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => console.error(error));
  }

  if (state.loading) {
    return "Loading..";
  } else if (!state.second_part_loaded) {
    return (
      <div>
        <p>{state.town}</p>
        <p>{state.ip}</p>
        <p>Улица:</p>
        <input
          type="text"
          id="street"
          className="form-control"
          placeholder="Allow only alphabets"
          value={txt}
          onChange={onInputChange}
        />

        <button type="submit" onClick={handleClick}>
          Отправить
        </button>
      </div>
    );
  } else if (state.second_part_loaded) {
    console.log(state.list_of_streets);
    return (
      <div>
        <p>{state.town}</p>
        <p>{state.ip}</p>
        <p>Улица:</p>
        <input
          type="text"
          id="street"
          className="form-control"
          placeholder="Allow only alphabets"
          value={txt}
          onChange={onInputChange}
        />

        <button type="submit" onClick={handleClick}>
          Отправить
        </button>
        <div>
          <select name="streets">{state.list_of_streets};</select>
        </div>
      </div>
    );
  }
}
const e = React.createElement;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(e(LikeButton));