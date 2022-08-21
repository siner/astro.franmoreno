function Stars({ number }) {
  function createList() {
    let list = [];
    for (let i = 0; i < 5; i++) {
      let stroke = "far";
      if (i < number) stroke = "fas";

      list.push(
        <li key={i}>
          <i className={`${stroke} fa-star fa-sm text-orange`}></i>
        </li>
      );
    }
    return list;
  }

  return <ul className="stars flex justify-center">{createList()}</ul>;
}
export default Stars;
