import { makeAutoObservable } from "mobx";
import { alertInterface } from "../types";

export interface storeInterface {
  isLoading: boolean;
  isBeingSubmitted: boolean;
  currentRoomId: string;
  userId: string;
  userName: string;
  addedAlert: boolean;
  alerts: alertInterface[];
  isSearching: boolean;
  searchText: string;
  isFiltering: boolean;
  filteringText: string;
  shouldUpdateRooms: boolean;
}
export default class Store {
  state: storeInterface;
  constructor() {
    this.state = {
      isLoading: false,
      isBeingSubmitted: false,
      alerts: [],
      currentRoomId: "",
      userId: "",
      userName: "",
      addedAlert: false,
      isSearching: false,
      searchText: "",
      isFiltering: false,
      filteringText: "",
      shouldUpdateRooms: false,
    };
    makeAutoObservable(this);
  }
  private createMessageId = () => {
    let largestId = 0;
    if (this.state.alerts.length === 0) return 1;
    this.state.alerts.forEach((alert) => {
      if (alert.id && alert.id > largestId) largestId = alert.id;
    });
    return largestId + 1;
  };
  setIsLoading = (isLoading: boolean) => {
    this.state.isLoading = isLoading;
  };
  setIsBeingSubmitted = (isBeingSubmitted: boolean) => {
    this.state.isBeingSubmitted = isBeingSubmitted;
  };
  setCurrentRoomId = (currentRoomId: string) => {
    this.state.currentRoomId = currentRoomId;
  };
  setUserId = (userId: string) => {
    this.state.userId = userId;
  };
  setUserName = (userName: string) => {
    this.state.userName = userName;
  };
  displaySuccess = (text: string) => {
    this.state.alerts.push({
      type: "success",
      text,
      id: this.createMessageId(),
    });
    this.state.addedAlert = true;
  };
  displayError = (text: string) => {
    this.state.alerts.push({
      type: "error",
      text,
      id: this.createMessageId(),
    });
    this.state.addedAlert = true;
  };

  removeAlert = (id: number) => {
    this.state.alerts = this.state.alerts.filter((alert) => alert.id !== id);
  };
  startSearching = (searchText: string) => {
    this.state.isSearching = true;
    this.state.searchText = searchText;
  };

  stopSearching = () => {
    this.state.isSearching = false;
    this.state.searchText = "";
  };

  startFiltering = (filteringText: string) => {
    this.state.isFiltering = true;
    this.state.filteringText = filteringText;
  };

  stopFiltering = () => {
    this.state.isFiltering = false;
    this.state.filteringText = "";
  };

  setShouldUpdateRooms = (shouldUpdateRooms: boolean) => {
    this.state.shouldUpdateRooms = shouldUpdateRooms;
  };
}
