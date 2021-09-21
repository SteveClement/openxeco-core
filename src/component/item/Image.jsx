import React, { Component } from "react";
import "./Image.css";
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import { getApiURL } from "../../utils/env.jsx";
import { validateWord } from "../../utils/re.jsx";
import Chip from "../button/Chip.jsx";
import Message from "../box/Message.jsx";
import { getRequest, postRequest } from "../../utils/request.jsx";
import Loading from "../box/Loading.jsx";

export default class Image extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.getImage = this.getImage.bind(this);
		this.updateImage = this.updateImage.bind(this);
		this.addKeyword = this.addKeyword.bind(this);
		this.deleteKeyword = this.deleteKeyword.bind(this);

		this.state = {
			image: null,
			word: null,
		};
	}

	onClick() {
		if (typeof this.props.disabled !== "undefined" || !this.props.disabled) {
			this.onOpen();

			const newState = !this.props.selected;
			if (typeof this.props.onClick !== "undefined") this.props.onClick(this.props.id, newState);
		}
	}

	getImage() {
		this.setState({
			image: null,
		}, () => {
			getRequest.call(this, "media/get_image/" + this.props.id, (data) => {
				this.setState({
					image: data,
				});
			}, (response) => {
				nm.warning(response.statusText);
			}, (error) => {
				nm.error(error.message);
			});
		});
	}

	updateImage(id, keywords) {
		const params = {
			id,
			keywords,
		};

		postRequest.call(this, "media/update_image", params, () => {
			this.setState({
				word: null,
			}, () => {
				this.getImage();
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	addKeyword(word) {
		if (this.state.image) {
			let words;

			if (this.state.image.keywords) {
				words = (this.state.image.keywords + " " + word).toLowerCase();
			} else {
				words = word.toLowerCase();
			}

			this.updateImage(this.state.image.id, words);
		}
	}

	deleteKeyword(word) {
		if (this.state.image && this.state.image.keywords) {
			let words = this.state.image.keywords.split(" ");
			words = words.filter((w) => w !== word).join(" ");
			this.updateImage(this.state.image.id, words);
		}
	}

	render() {
		return (
			<Popup
				className="Popup-full-size"
				trigger={
					<div className={"Image " + (this.state.selected ? "Image-selected" : "")}>
						<div className={"Image-image"}>
							<img src={"data:image/jpeg;base64, " + this.props.thumbnail}/>
						</div>

						{this.props.width && this.props.height
							&& <div className={"Image-text"}>
								{this.props.width}x{this.props.height}
							</div>
						}

						{this.props.creationDate
							&& <div className={"Image-text"}>
								{this.props.creationDate}
							</div>
						}
					</div>
				}
				modal
				closeOnDocumentClick
				onOpen={this.getImage}
			>
				<div className="row">
					<div className="col-md-12">
						<h1 className="Image-title">
                            Image
						</h1>
					</div>

					<div className="col-md-12">
						{this.state.image
							? <div className="row">
								<div className="col-md-12">
									<div className={"Image-image"}>
										<img src={getApiURL() + "public/get_public_image/" + this.props.id}/>
									</div>
								</div>

								<div className="col-md-12 Image-size">
									<b>{this.state.image.width}x{this.state.image.height}</b>
								</div>

								<div className="col-md-12">
									<h3>Keywords</h3>
								</div>

								<div className="col-md-12">
									<input
										autoFocus
										className={!validateWord(this.state.word) ? "FormLine-wrong-format" : ""}
										type={"text"}
										value={this.state.word}
										onChange={(v) => this.setState({ word: v.target.value })}
										onKeyPress={(e) => {
											if (e.key === "Enter" && validateWord(this.state.word)) {
												this.addKeyword(this.state.word);
											}
										}}
									/>
								</div>

								<div className="col-md-12 right-buttons">
									<button
										onClick={() => this.addKeyword(this.state.word)}
										disabled={!validateWord(this.state.word)}
									>
										Add keyword
									</button>
								</div>

								<div className="col-md-12">
									{this.state.image.keywords
										? this.state.image.keywords.split(" ").map((w) => <Chip
											key={w}
											label={w}
											value={w}
											onClick={(v) => this.deleteKeyword(v)}
										/>)
										: <Message
											text={"No keyword for this image"}
											height={150}
										/>
									}
								</div>
							</div>
							: <Loading
								height={300}
							/>
						}
					</div>
				</div>
			</Popup>
		);
	}
}
