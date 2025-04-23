import { useEffect, useRef, useState } from 'react'
import './index.css'

const stepsPerDigit = 360

function App() {
  //lưu số hiện tại hiển thị
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  //lưu góc quay tích lũy
  const leftRotation = useRef(0)
  const rightRotation = useRef(0)

  //góc quay thực tế ở trên ui
  const [leftRotationDeg, setLeftRotationDeg] = useState(0)
  const [rightRotationDeg, setRightRotationDeg] = useState(0)

  //Lưu trạng thái số nhưng k kích hoạt re-render dùng để xử lý logic nội bộ
  const leftRef = useRef(left)
  const rightRef = useRef(right)

  const dragging = useRef(null)
  const lastAngle = useRef(0)

  const handleMouseDown = (wheel) => (e) => {
    dragging.current = wheel

    const rect = e.target.closest('.wheel').getBoundingClientRect()

    //Xác định tâm của bánh xe
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    //Tính góc của chuột so với tâm bánh xe(center)
    const getAngle = (e) => {
      //Math.atan2 return về radian
      return (
        Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI)
      )
    }

    //Lưu góc ban đầu
    lastAngle.current = getAngle(e)

    const onMouseMove = (e) => {
      const angle = getAngle(e)
      console.log('🚀 ~ App.jsx:50 ~ angle:', angle)

      let delta = angle - lastAngle.current //so sánh góc khi move so với góc ban đầu

      // Xử lý qua biên -180/+180
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360

      lastAngle.current = angle //Lưu góc để xử lý lần kéo tiếp theo

      if (wheel === 'right') {
        //update góc tích lũy
        rightRotation.current += delta

        setRightRotationDeg((prev) => prev + delta)

        let steps = Math.floor(rightRotation.current / stepsPerDigit)

        if (steps !== 0) {
          for (let i = 0; i < Math.abs(steps); i++) {
            if (steps > 0) {
              if (rightRef.current === 9) {
                rightRef.current = 0
                leftRef.current = (leftRef.current + 1) % 10
              } else {
                rightRef.current += 1
              }
            } else {
              if (rightRef.current === 0) {
                rightRef.current = 9
                leftRef.current = (leftRef.current - 1 + 10) % 10
              } else {
                rightRef.current -= 1
              }
            }
          }

          // Cập nhật state từ ref (sẽ render lại UI)
          setRight(rightRef.current)
          setLeft(leftRef.current)

          rightRotation.current -= steps * stepsPerDigit
        }
      }

      if (wheel === 'left') {
        leftRotation.current += delta

        setLeftRotationDeg((prev) => prev + delta)

        let steps = Math.floor(leftRotation.current / stepsPerDigit)

        if (steps !== 0) {
          for (let i = 0; i < Math.abs(steps); i++) {
            if (steps > 0) {
              leftRef.current = (leftRef.current + 1) % 10
            } else {
              leftRef.current = (leftRef.current - 1 + 10) % 10
            }
          }

          setLeft(leftRef.current)
          leftRotation.current -= steps * stepsPerDigit
        }
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      dragging.current = null
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  useEffect(() => {
    leftRef.current = left
  }, [left])

  useEffect(() => {
    rightRef.current = right
  }, [right])

  return (
    <div className='app'>
      <h1 className='title'>PASCALINE COMPUTER SIMULATION</h1>
      <div className='pascaline'>
        <div className='main-content'>
          <div className='gear-container'>
            <div className='number'>{left}</div>
            <div className='wheel' onMouseDown={handleMouseDown('left')}>
              <img
                src='https://img.icons8.com/external-those-icons-lineal-those-icons/100/FFFFFF/external-wheel-cars-components-those-icons-lineal-those-icons.png'
                alt='Left Gear'
                className='wheel-img'
                style={{ transform: `rotate(${leftRotationDeg / 360}turn)` }}
              />
            </div>
          </div>

          <div className='gear-container'>
            <div className='number'>{right}</div>
            <div className='wheel' onMouseDown={handleMouseDown('right')}>
              <img
                src='https://img.icons8.com/external-those-icons-lineal-those-icons/100/FFFFFF/external-wheel-cars-components-those-icons-lineal-those-icons.png'
                alt='Right Gear'
                className='wheel-img'
                style={{ transform: `rotate(${rightRotationDeg / 360}turn)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
