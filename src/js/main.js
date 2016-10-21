import "../css/main.css"
import React from "react"
import ReactDOM from "react-dom"
import BlogStore from "./BlogStore"
import BlogList from "./BlogList"

const app = document.getElementById("app")

ReactDOM.render(<BlogList store={BlogStore} />, app);