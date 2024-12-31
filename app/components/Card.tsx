import React from 'react'

const Card = ({ imageUrl, width, height, eventName, venue, city, province, date, ticketmasterLink }: { imageUrl: string, width: number, height: number, eventName: string, venue: string, city: string, province: string, date: string, ticketmasterLink: string }) => {
  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl mb-3 h-96">
        <figure>
            <img
            src={imageUrl}
            width={width}
            height={height}
            alt="Artist Image" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{eventName}</h2>
            <div className='flex flex-row justify-between'>
              <div className="flex flex-col">
                <p>{venue} | {city}, {province}</p>
                <p>{date}</p>
              </div>
              <a target='_blank' href={ticketmasterLink}>
                <button className="btn btn-primary">View</button>
              </a>
            </div>
        </div>
    </div>
  )
}

export default Card
