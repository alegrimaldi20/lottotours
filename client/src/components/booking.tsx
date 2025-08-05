export default function Booking() {
  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" data-testid="booking-title">
            Ready to Win Your Dream Trip?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto" data-testid="booking-subtitle">
            Join thousands of adventurers who have already won amazing travel experiences through our verified lottery system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/lotteries"
              className="bg-gradient-to-r from-lottery-gold to-lottery-orange text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all inline-block text-center"
              data-testid="button-view-lotteries"
            >
              View Travel Lotteries
            </a>
            <a 
              href="/token-shop"
              className="border-2 border-lottery-purple text-lottery-purple px-8 py-4 rounded-lg font-semibold text-lg hover:bg-lottery-purple hover:text-white transition-all inline-block text-center"
              data-testid="button-buy-tokens"
            >
              Buy Tokens
            </a>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🎫</div>
              <h3 className="font-semibold mb-2">Purchase Tickets</h3>
              <p className="text-slate-600 text-sm">Buy lottery tickets with tokens for your chance to win amazing travel packages</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🎲</div>
              <h3 className="font-semibold mb-2">Verified Draws</h3>
              <p className="text-slate-600 text-sm">All lottery drawings are blockchain-verified with unique identification codes</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">✈️</div>
              <h3 className="font-semibold mb-2">Real Travel</h3>
              <p className="text-slate-600 text-sm">Win authentic travel experiences with flights, accommodations, and activities included</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}