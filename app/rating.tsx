'use client'
import ReactSpeedometer from 'react-d3-speedometer'

export default function Rating(props: { rating: integer } ) {
  const { rating } = props

  return <ReactSpeedometer 
    value={rating}
    maxValue={100}
    startColor='blue'
    endColor='red'
    segments={200}
    ringWidth={15}
    width={150}
    height={80}
    needleHeightRatio={0.40}
    maxSegmentLabels={0}
    currentValueText={''}
    needleColor='grey'
    svgAriaLabel={`Rating of ${rating}`}
  />
}

