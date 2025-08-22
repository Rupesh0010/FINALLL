import React from 'react'
export const Button = ({children, onClick}) => {
  return <button onClick={onClick} style={{
    background:'linear-gradient(90deg,#06b6d4,#7c3aed)',
    border:'none',
    color:'#001',
    padding:'8px 12px',
    borderRadius:10,
    fontWeight:700,
    cursor:'pointer'
  }}>{children}</button>
}
