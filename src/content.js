/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer } from "react-frame-component";
import "./content.css";

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
app.style.display = "none";

class Main extends React.Component {
  state = {
    rank: "",
    keyword: ""
  };
  componentWillMount = () => {
    const ctx = this;
    let rank;
    let keyword;
    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse
    ) {
      // var page;
      if (request.message === "open_google_tab") {
        let reg = new RegExp("q=([^&#]*)");
        let query = reg.exec(request.url);
        let splitQuery = query[0].split("=");
        query = splitQuery[1];

        keyword = query.split("+").join(" ");
        var parentDiv = document.querySelectorAll("a h3");
        if (!document.querySelectorAll("a h3 span").length) {
          console.log('Object.keys(parentDiv)', Object.keys(parentDiv).length);
          localStorage.setItem('length', Object.keys(parentDiv).length);
          Object.keys(parentDiv).map((el, i) => {
            var newSpan = document.createElement("span");
            newSpan.className = "numbering";
            newSpan.innerHTML = `${i + 1}. `;
            parentDiv[i].prepend(newSpan);
          });
        }
        let url = document.querySelectorAll("cite");
        Object.keys(url).map((el, i) => {
          if (url[i].innerHTML.includes("deorwine.com")) {
            rank = i + 1;
          }

          return ctx.setState({ rank, keyword });
        });
      }

      if (request.message === "clicked_browser_action") {
        if (app.style.display === "none") {
          app.style.display = "block";
        } else {
          app.style.display = "none";
        }
      }
    });
  };

  render() {
    const { rank, keyword } = this.state;
    return (
      <Frame
        head={[
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/content.css")}
          />
        ]}
      >
        <FrameContextConsumer>
          {// Callback is invoked with iframe's window and document instances
          ({ document, window }) => {
            // Render Children
            return (
              <div className={"my-extension"}>
                <p>Site Name: Deorwine</p>
                <p>Rank is: {rank ? rank : 'Not Found'}</p>
                <p> Keyword is: {keyword}</p>
              </div>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    );
  }
}

ReactDOM.render(<Main />, app);
console.log("chrome", chrome);
