import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Plus, Search, ArrowUpRight, ArrowDownRight,
  PieChart, Eye, EyeOff, MoreHorizontal, X, DollarSign, BarChart3,
  Star, Filter, RefreshCw
} from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  sector: string;
  color: string;
}

const mockHoldings: Holding[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 145.20, currentPrice: 198.45, change: 2.34, changePercent: 1.19, sector: 'Technology', color: 'bg-blue-500' },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgCost: 280.50, currentPrice: 425.80, change: -1.20, changePercent: -0.28, sector: 'Technology', color: 'bg-blue-500' },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 20, avgCost: 105.00, currentPrice: 175.30, change: 3.15, changePercent: 1.83, sector: 'Technology', color: 'bg-blue-500' },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 25, avgCost: 128.75, currentPrice: 195.60, change: -0.85, changePercent: -0.43, sector: 'Consumer', color: 'bg-orange-500' },
  { id: '5', symbol: 'JPM', name: 'JPMorgan Chase', shares: 40, avgCost: 142.30, currentPrice: 198.50, change: 1.75, changePercent: 0.89, sector: 'Financial', color: 'bg-green-500' },
  { id: '6', symbol: 'JNJ', name: 'Johnson & Johnson', shares: 35, avgCost: 155.80, currentPrice: 162.40, change: 0.45, changePercent: 0.28, sector: 'Healthcare', color: 'bg-red-500' },
  { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 15, avgCost: 450.00, currentPrice: 875.30, change: 12.50, changePercent: 1.45, sector: 'Technology', color: 'bg-blue-500' },
  { id: '8', symbol: 'V', name: 'Visa Inc.', shares: 20, avgCost: 230.40, currentPrice: 285.60, change: -0.90, changePercent: -0.31, sector: 'Financial', color: 'bg-green-500' },
];

const watchlist = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: 3.42, changePercent: 1.41 },
  { symbol: 'META', name: 'Meta Platforms', price: 505.25, change: -2.10, changePercent: -0.41 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 628.90, change: 5.80, changePercent: 0.93 },
  { symbol: 'AMD', name: 'AMD Inc.', price: 178.45, change: -1.35, changePercent: -0.75 },
];

export default function Portfolio() {
  const [holdings] = useState<Holding[]>(mockHoldings);
  const [showValues, setShowValues] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'holdings' | 'watchlist'>('holdings');
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'name'>('value');

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  const dayChange = holdings.reduce((sum, h) => sum + h.shares * h.change, 0);
  const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100;

  // Sector allocation
  const sectorMap = holdings.reduce<Record<string, number>>((acc, h) => {
    const val = h.shares * h.currentPrice;
    acc[h.sector] = (acc[h.sector] || 0) + val;
    return acc;
  }, {});
  const sectors = Object.entries(sectorMap)
    .map(([name, value]) => ({ name, value: value as number, percent: ((value as number) / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value);

  const sectorColors: Record<string, string> = {
    'Technology': 'bg-blue-500',
    'Consumer': 'bg-orange-500',
    'Financial': 'bg-green-500',
    'Healthcare': 'bg-red-500',
  };

  const filteredHoldings = holdings
    .filter(h =>
      h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'value') return (b.shares * b.currentPrice) - (a.shares * a.currentPrice);
      if (sortBy === 'change') return b.changePercent - a.changePercent;
      return a.name.localeCompare(b.name);
    });

  const formatCurrency = (val: number) => {
    if (!showValues) return '****';
    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatPercent = (val: number) => {
    if (!showValues) return '**%';
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Portfolio Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Track your investments and monitor performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showValues ? 'Hide' : 'Show'}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Holding
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total Value</span>
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-gray-400 mt-1">Across {holdings.length} holdings</p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Day's Change</span>
            <div className={`p-1.5 rounded-lg ${dayChange >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {dayChange >= 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(dayChange)}</p>
          <p className={`text-sm font-medium mt-1 ${dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(dayChangePercent)} today
          </p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total Gain/Loss</span>
            <div className={`p-1.5 rounded-lg ${totalGain >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {totalGain >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGain)}</p>
          <p className={`text-sm font-medium mt-1 ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(totalGainPercent)} all time
          </p>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total Invested</span>
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-gray-400 mt-1">Cost basis</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-between px-5 pt-4 pb-0">
            <div className="flex items-center gap-4 border-b border-gray-200 w-full">
              <button
                onClick={() => setActiveTab('holdings')}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'holdings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Holdings ({holdings.length})
              </button>
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'watchlist'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Watchlist ({watchlist.length})
              </button>
            </div>
          </div>

          {activeTab === 'holdings' && (
            <>
              {/* Search & Sort */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search holdings..."
                    className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'value' | 'change' | 'name')}
                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="value">Sort by Value</option>
                    <option value="change">Sort by Change</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-y border-gray-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">Asset</th>
                      <th className="px-5 py-3 font-medium text-right">Price</th>
                      <th className="px-5 py-3 font-medium text-right">Change</th>
                      <th className="px-5 py-3 font-medium text-right">Shares</th>
                      <th className="px-5 py-3 font-medium text-right">Avg Cost</th>
                      <th className="px-5 py-3 font-medium text-right">Market Value</th>
                      <th className="px-5 py-3 font-medium text-right">Gain/Loss</th>
                      <th className="px-5 py-3 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredHoldings.map((holding) => {
                      const marketValue = holding.shares * holding.currentPrice;
                      const costBasis = holding.shares * holding.avgCost;
                      const gain = marketValue - costBasis;
                      const gainPercent = (gain / costBasis) * 100;

                      return (
                        <tr key={holding.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${holding.color} flex items-center justify-center text-white text-xs font-bold`}>
                                {holding.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{holding.symbol}</p>
                                <p className="text-xs text-gray-400">{holding.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-medium text-gray-900">
                            ${holding.currentPrice.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              holding.change >= 0
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {holding.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {Math.abs(holding.changePercent).toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right text-gray-700">
                            {showValues ? holding.shares : '**'}
                          </td>
                          <td className="px-5 py-3.5 text-right text-gray-500">
                            {showValues ? `$${holding.avgCost.toFixed(2)}` : '****'}
                          </td>
                          <td className="px-5 py-3.5 text-right font-medium text-gray-900">
                            {formatCurrency(marketValue)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div>
                              <span className={`font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(gain)}
                              </span>
                              <p className={`text-xs ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatPercent(gainPercent)}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'watchlist' && (
            <div className="p-5">
              <div className="space-y-3">
                {watchlist.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <div>
                        <p className="font-medium text-gray-900">{item.symbol}</p>
                        <p className="text-xs text-gray-400">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs font-medium ${
                        item.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                <Plus className="w-4 h-4" />
                Add to Watchlist
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Asset Allocation */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Asset Allocation</h3>
              <PieChart className="w-4 h-4 text-gray-400" />
            </div>

            {/* Visual bar */}
            <div className="flex rounded-full overflow-hidden h-3 mb-4">
              {sectors.map((sector) => (
                <div
                  key={sector.name}
                  className={`${sectorColors[sector.name] || 'bg-gray-400'}`}
                  style={{ width: `${sector.percent}%` }}
                />
              ))}
            </div>

            <div className="space-y-3">
              {sectors.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${sectorColors[sector.name] || 'bg-gray-400'}`} />
                    <span className="text-sm text-gray-700">{sector.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{sector.percent.toFixed(1)}%</span>
                    <p className="text-xs text-gray-400">{formatCurrency(sector.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {[...holdings]
                .sort((a, b) => {
                  const gainA = ((a.currentPrice - a.avgCost) / a.avgCost) * 100;
                  const gainB = ((b.currentPrice - b.avgCost) / b.avgCost) * 100;
                  return gainB - gainA;
                })
                .slice(0, 4)
                .map((h) => {
                  const gainPct = ((h.currentPrice - h.avgCost) / h.avgCost) * 100;
                  return (
                    <div key={h.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${h.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{h.symbol}</p>
                          <p className="text-xs text-gray-400">{h.shares} shares</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {showValues ? `+${gainPct.toFixed(1)}%` : '**%'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Best Performer</span>
                <span className="text-sm font-medium text-gray-900">NVDA</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Largest Holding</span>
                <span className="text-sm font-medium text-gray-900">NVDA</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Total Sectors</span>
                <span className="text-sm font-medium text-gray-900">{sectors.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Portfolio Beta</span>
                <span className="text-sm font-medium text-gray-900">1.15</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-lg">Add Holding</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol / Name</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a stock..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Cost per Share</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add any notes about this position..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Add Holding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
