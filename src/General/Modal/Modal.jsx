import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import importcss from 'importcss';
import cx from 'classnames';

export default class MyModal extends Component {
  static childContextTypes = {
    _modal: PropTypes.func,
  }
  static defaultProps = {
    emitter: null,
    event: null,
    fullscreen: false,
    children: null,
  }
  static propTypes = {
    emitter: PropTypes.object,
    fullscreen: PropTypes.bool,
    children: PropTypes.any,
  }
  constructor(props) {
    super(props);
    this.state = { visible: false };
    // if (props.event) {
    //
    // }
  }
  getChildContext() {
    return {
      _modal: ({ type }) => {
        if (type === 'open') {
          this.setState({ visible: true });
        }
        if (type === 'close') {
          this.setState({ visible: false });
        }
        return this.state;
      },
    };
  }
  componentDidMount() {
    const { emitter } = this.props;
    if (emitter) {
      emitter.on('open', () => {
        this.setState({
          visible: true,
        });
      });
      emitter.on('close', () => {
        this.setState({
          visible: false,
        });
      });
    }
  }
  // componenWillUnmount() {
  //   if (this.props.emitter) {
  //
  //   }
  // }
  render() {
    // return this.props.children
    const { fullscreen, children } = this.props;
    let className = '';
    if (fullscreen) {
      className = 'modal-fullscreen';
    }
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}

export class ModalButton extends Component { // eslint-disable-line
  static contextTypes = {
    _modal: PropTypes.func,
  }
  static defaultProps = {
    id: 'single',
    type: 'open',
    children: '',
  }
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.string,
  }
  @autobind
  handle() {
    const { type, id } = this.props;
    this.context._modal({ type, id });
  }
  render() {
    const { children } = this.props;
    return (
      <span onClick={this.handle}>
        {children}
      </span>
    );
  }
}

MyModal.Button = ModalButton;
MyModal.Trigger = ModalButton;

// @importcss(require('./ModalContent.css'))
export class ModalContent extends Component { // eslint-disable-line
  static contextTypes = {
    _modal: PropTypes.func,
  }
  static defaultProps = {
    id: 'single',
    children: '',
    title: null,
    fullscreen: false,
  }
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.any,
    title: PropTypes.string,
    fullscreen: PropTypes.bool,
  }
  @autobind
  handle() {
    const { id } = this.props;
    this.context._modal({ type: 'close', id });
  }
  render() {
    const { id, fullscreen, title, children } = this.props;
    const state = this.context._modal({ type: 'state', id });
    return (
      <Modal
        show={state.visible}
        onHide={this.handle}
        dialogClassName={cx({
          'modal-fullscreen': fullscreen,
        })}
      >
        <If condition={title}>
          <Modal.Header closeButton>
            {title}
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
        </If>
        <If condition={!title}>
          {children}
        </If>
        {/* <Modal.Footer>
          <Button onClick={this.close.bind(this)}>Закрыть</Button>
        </Modal.Footer>*/}
      </Modal>
    );
  }
}

MyModal.Content = ModalContent;
MyModal.Header = Modal.Header;
MyModal.Body = Modal.Body;
MyModal.Footer = Modal.Footer;
MyModal.Title = Modal.Title;
