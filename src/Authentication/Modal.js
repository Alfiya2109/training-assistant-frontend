import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay" onClick={onClose} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                {/* Prevent the modal content from closing when clicked */}
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute',
                        top: '0px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '30px',
                        cursor: 'pointer'
                    }}>×</button>
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
};

export default Modal;
