import React, { useState } from 'react';
import api from '../api/axios';
import {
  ShieldAlert, TrendingUp, AlertTriangle,
  Info, Lightbulb, RefreshCw, Brain,
  CheckCircle, Sparkles
} from 'lucide-react';

const AnomalyPage = () => {
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [activeTab, setActiveTab] = useState<'anomalies' | 'predictions'>('anomalies');

  const fetchAnomalies = async () => {
    setLoadingAnomalies(true);
    try {
      const res = await api.get('/ai/anomalies');
      setAnomalyData(res.data);
    } catch {
      console.error('Failed to fetch anomalies');
    }
    setLoadingAnomalies(false);
  };

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const res = await api.get('/ai/predictions');
      setPrediction(res.data);
    } catch {
      console.error('Failed to fetch predictions');
    }
    setLoadingPredictions(false);
  };

  const getAnomalyStyle = (type: string) => {
    switch (type) {
      case 'DANGER':
        return {
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          icon: <AlertTriangle size={18} className="text-red-400" />,
          badge: 'bg-red-500/20 text-red-400',
          color: 'text-red-400'
        };
      case 'WARNING':
        return {
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/10',
          icon: <AlertTriangle size={18} className="text-amber-400" />,
          badge: 'bg-amber-500/20 text-amber-400',
          color: 'text-amber-400'
        };
      default:
        return {
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          icon: <Info size={18} className="text-blue-400" />,
          badge: 'bg-blue-500/20 text-blue-400',
          color: 'text-blue-400'
        };
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Brain size={20} className="text-white" />
          </div>
          AI Financial Insights
        </h1>
        <p className="text-slate-400 mt-1 ml-13">
          Powered by Llama 3.3 — detects anomalies and predicts your financial future
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition
            ${activeTab === 'anomalies'
              ? 'balance-gradient text-white shadow-lg shadow-indigo-500/20'
              : 'glass text-slate-400 hover:text-white'}`}
        >
          🔍 Anomaly Detection
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition
            ${activeTab === 'predictions'
              ? 'balance-gradient text-white shadow-lg shadow-indigo-500/20'
              : 'glass text-slate-400 hover:text-white'}`}
        >
          🔮 Spending Predictions
        </button>
      </div>

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          {/* Scan button */}
          {!anomalyData && (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl ai-gradient flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                <ShieldAlert size={36} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Scan Your Finances for Anomalies
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                Our AI analyzes your spending patterns, detects unusual transactions,
                overspending categories, and financial risks in real time.
              </p>
              <button
                onClick={fetchAnomalies}
                disabled={loadingAnomalies}
                className="balance-gradient text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loadingAnomalies ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Analyzing your data...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Run AI Anomaly Scan
                  </>
                )}
              </button>
            </div>
          )}

          {anomalyData && (
            <>
              {/* Financial health summary */}
              <div className="glass rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Brain size={18} className="text-indigo-400" />
                    Financial Health Summary
                  </h3>
                  <button
                    onClick={fetchAnomalies}
                    disabled={loadingAnomalies}
                    className="flex items-center gap-2 glass text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    <RefreshCw size={14} className={loadingAnomalies ? 'animate-spin' : ''} />
                    Re-scan
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-slate-400 text-xs mb-1">Total Income</p>
                    <p className="text-green-400 font-bold">
                      ₹{Number(anomalyData.totalIncome || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-slate-400 text-xs mb-1">Total Expense</p>
                    <p className="text-red-400 font-bold">
                      ₹{Number(anomalyData.totalExpense || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-xl border ${
                    Number(anomalyData.expenseRatio) > 80
                      ? 'bg-red-500/10 border-red-500/20'
                      : Number(anomalyData.expenseRatio) > 60
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-green-500/10 border-green-500/20'
                  }`}>
                    <p className="text-slate-400 text-xs mb-1">Expense Ratio</p>
                    <p className={`font-bold ${
                      Number(anomalyData.expenseRatio) > 80 ? 'text-red-400' :
                      Number(anomalyData.expenseRatio) > 60 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {Number(anomalyData.expenseRatio || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed bg-white/3 rounded-xl p-4 border border-white/5">
                  {anomalyData.summary}
                </p>
              </div>

              {/* Anomalies list */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-400" />
                  Detected Issues ({anomalyData.anomalies?.length || 0})
                </h3>

                {anomalyData.anomalies?.length > 0 ? (
                  <div className="space-y-3">
                    {anomalyData.anomalies.map((anomaly: any, index: number) => {
                      const style = getAnomalyStyle(anomaly.type);
                      return (
                        <div
                          key={index}
                          className={`glass rounded-2xl p-5 border ${style.border} animate-fade-in`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                              {style.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-white font-medium">{anomaly.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                                  {anomaly.type}
                                </span>
                                {anomaly.category && (
                                  <span className="text-xs glass px-2 py-0.5 rounded-full text-slate-400">
                                    {anomaly.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                                {anomaly.description}
                              </p>
                              {anomaly.suggestion && (
                                <div className="flex items-start gap-2 bg-white/3 rounded-xl p-3 border border-white/5">
                                  <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-slate-400 text-xs leading-relaxed">
                                    <span className="text-amber-400 font-medium">Suggestion: </span>
                                    {anomaly.suggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-8 text-center">
                    <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-medium">No anomalies detected!</p>
                    <p className="text-slate-500 text-sm mt-1">Your finances look healthy 🎉</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {!prediction && (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl balance-gradient flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                <TrendingUp size={36} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Predict Your Financial Future
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                AI analyzes your spending patterns and predicts next month's expenses,
                savings rate, and gives personalized tips to improve your finances.
              </p>
              <button
                onClick={fetchPredictions}
                disabled={loadingPredictions}
                className="balance-gradient text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loadingPredictions ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Generating predictions...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate AI Predictions
                  </>
                )}
              </button>
            </div>
          )}

          {prediction && (
            <div className="space-y-4">
              {/* Prediction metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-5 text-center card-hover">
                  <p className="text-slate-400 text-xs mb-2">Next Month Expense</p>
                  <p className="text-red-400 font-bold text-2xl">
                    ₹{Number(prediction.nextMonthExpense || 0).toLocaleString()}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">Predicted</p>
                </div>
                <div className="glass rounded-2xl p-5 text-center card-hover">
                  <p className="text-slate-400 text-xs mb-2">Savings Rate</p>
                  <p className={`font-bold text-2xl ${
                    Number(prediction.savingsRate) > 20 ? 'text-green-400' :
                    Number(prediction.savingsRate) > 10 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {Number(prediction.savingsRate || 0).toFixed(1)}%
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {Number(prediction.savingsRate) > 20 ? 'Excellent' :
                     Number(prediction.savingsRate) > 10 ? 'Good' : 'Needs Work'}
                  </p>
                </div>
                <div className="glass rounded-2xl p-5 text-center card-hover">
                  <p className="text-slate-400 text-xs mb-2">Top Risk Category</p>
                  <p className="text-amber-400 font-bold text-lg">
                    {prediction.topRiskCategory || 'N/A'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">Highest spending</p>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="glass rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Brain size={18} className="text-indigo-400" />
                    AI Financial Prediction
                  </h3>
                  <button
                    onClick={fetchPredictions}
                    disabled={loadingPredictions}
                    className="flex items-center gap-2 glass text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    <RefreshCw size={14} className={loadingPredictions ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed bg-white/3 rounded-xl p-4 border border-white/5">
                  {prediction.prediction}
                </p>
              </div>

              {/* Tips */}
              {prediction.tips?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-400" />
                    Personalized Tips to Improve Finances
                  </h3>
                  <div className="space-y-3">
                    {prediction.tips.map((tip: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="w-6 h-6 rounded-full ai-gradient flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                          {i + 1}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Savings Rate visual */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Savings Rate Health</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Your Rate: {Number(prediction.savingsRate || 0).toFixed(1)}%</span>
                  <span className="text-slate-400">Target: 20%+</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4 mb-3">
                  <div
                    className="h-4 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(Number(prediction.savingsRate || 0), 100)}%`,
                      background: Number(prediction.savingsRate) > 20
                        ? 'linear-gradient(90deg, #10b981, #059669)'
                        : Number(prediction.savingsRate) > 10
                          ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                          : 'linear-gradient(90deg, #ef4444, #dc2626)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span className="text-red-400">Critical &lt;10%</span>
                  <span className="text-amber-400">Good 10-20%</span>
                  <span className="text-green-400">Excellent 20%+</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnomalyPage;