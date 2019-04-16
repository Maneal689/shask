import React, { Component } from "react";
import "bootstrap";

class CollaboratorList extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.uniqfy = this.uniqfy.bind(this);
    this.userCard = this.userCard.bind(this);
    this.getUserTabList = this.getUserTabList.bind(this);
  }

  uniqfy(objTab) {
    let res = [];
    let passed = {};
    for (let elm of objTab) {
      if (!(elm.id_user in passed)) {
        res.push(elm);
        passed[elm.id_user] = true;
      }
    }
    return res;
  }

  userCard(userData) {
    if (userData) {
      if (!userData.image_url)
        userData.image_url =
          "https://upload.wikimedia.org/wikipedia/commons/3/3c/Cc-by_new.svg";
      return (
        <li className="list-group-item">
          <div className="d-flex" style={{ maxHeight: "2em" }}>
            <img
              className="mr-5 rounded-circle"
              style={{ height: "2em", width: "2em" }}
              src={userData.image_url}
            />
            <span className="align-self-center">{userData.username}</span>
          </div>
        </li>
      );
    }
    return <div />;
  }

  getUserTabList(userList, title) {
    let userTabList = undefined;
    let id = title + "ID";
    if (userList) userTabList = userList.map(elm => this.userCard(elm));
    return (
      <div>
        <a
          data-toggle="collapse"
          style={{ textDecoration: "none" }}
          href={(() => "#" + id)()}
        >
          <h3>{title}</h3>
        </a>
        <div className="collapse show" id={id}>
          <ul className="list-group list-group-flush">
            {userTabList || (
              <li class="list-group-item">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.props.friendsIdList && !this.state.friendsList) {
      this.setState({ friendsList: [] });
      for (let i = 0; i < this.props.friendsIdList.length; i++) {
        let cId = this.props.friendsIdList[i];

        fetch("/api/user/info-of/" + cId, { method: "GET" })
          .then(res => res.json())
          .then(data => {
            let cFriendList = this.state.friendsList;
            cFriendList.push(data.info);
            this.setState({ friendsList: cFriendList });
          });
      }
    }
    if (this.props.projectsIdList && !this.state.collaboratorsList) {
      this.setState({ collaboratorsList: [] });
      for (let i = 0; i < this.props.projectsIdList.length; i++) {
        let cId = this.props.projectsIdList[i];

        fetch("/api/project/" + cId + "/collaborators/", {
          method: "GET",
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "OK") {
              let cCollaboratorsList = this.state.collaboratorsList;
              data.collaboratorsList.forEach(elm => {
                if (elm.id_user != this.props.myId)
                  cCollaboratorsList.push(elm);
              });
              cCollaboratorsList = this.uniqfy(cCollaboratorsList);
              this.setState({
                collaboratorsList: cCollaboratorsList,
              });
            }
          });
      }
    }
  }

  render() {
    return (
      <div className="text-center d-flex flex-column border-0">
        {this.getUserTabList(this.state.collaboratorsList, "Collaborateurs")}
      </div>
    );
  }
}

export default CollaboratorList;
