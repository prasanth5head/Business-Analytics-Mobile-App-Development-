import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/market_provider.dart';
import '../widgets/kpi_card.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final TextEditingController _amountController = TextEditingController();
  String _selectedMonth = 'Jan';
  final List<String> _months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MarketProvider>().fetchData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Global Operations Center', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<MarketProvider>().fetchData(),
          ),
        ],
      ),
      body: Consumer<MarketProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.marketData == null) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null && provider.marketData == null) {
            return Center(child: Text(provider.error!));
          }

          final data = provider.marketData!;
          final ai = provider.aiRecommendations;

          return RefreshIndicator(
            onRefresh: provider.fetchData,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 24),
                  _buildQuickAction(),
                  const SizedBox(height: 24),
                  if (ai != null) _buildAiInsight(ai.aiAnalysis),
                  const SizedBox(height: 24),
                  _buildKpiGrid(data.summary),
                  const SizedBox(height: 24),
                  _buildSalesChart(data.salesData),
                  const SizedBox(height: 24),
                  if (ai != null) _buildRecommendations(ai.recommendations),
                  const SizedBox(height: 80), // Space for fab or bottom navigation
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddRevenueDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Operational Dashboard',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
        ),
        Text(
          'Real-time market tracking & AI-driven strategic intelligence.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildQuickAction() {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Theme.of(context).dividerColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.add_circle_outline, color: Colors.blue),
                SizedBox(width: 8),
                Text('Manual Revenue Entry', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _amountController,
                    decoration: const InputDecoration(
                      labelText: 'Amount',
                      prefixText: '₹ ',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedMonth,
                      items: _months.map((String month) {
                        return DropdownMenuItem<String>(
                          value: month,
                          child: Text(month),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedMonth = value!;
                        });
                      },
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _handleAddRevenue,
                child: const Text('Add Data'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAiInsight(String analysis) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.indigo.shade900, Colors.indigo.shade700],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'AI INSIGHT',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
              ),
              Chip(
                label: Text('LIVE ANALYSIS', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                backgroundColor: Colors.white24,
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            analysis,
            style: const TextStyle(color: Colors.white, fontSize: 14),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildKpiGrid(dynamic summary) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.5,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: [
        KpiCard(
          title: 'Total Revenue',
          value: '₹${summary.totalSales.toInt()}',
          percentage: summary.growthRate,
          icon: Icons.attach_money,
          color: Colors.green,
          up: true,
        ),
        KpiCard(
          title: 'Active Customers',
          value: '${summary.activeUsers}',
          percentage: summary.customerGrowth,
          icon: Icons.people,
          color: Colors.blue,
          up: true,
        ),
        KpiCard(
          title: 'Avg Profit',
          value: '₹${summary.avgProfit.toInt()}',
          percentage: summary.profitGrowth,
          icon: Icons.trending_up,
          color: Colors.purple,
          up: true,
        ),
        KpiCard(
          title: 'Volatility',
          value: 'Low',
          percentage: 'Stable',
          icon: Icons.notifications_active,
          color: Colors.orange,
          up: false,
        ),
      ],
    );
  }

  Widget _buildSalesChart(List<dynamic> salesData) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Theme.of(context).dividerColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Sales vs Profit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: false),
                  titlesData: const FlTitlesData(show: false),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: salesData.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.sales)).toList(),
                      isCurved: true,
                      color: Colors.blue,
                      barWidth: 3,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(show: true, color: Colors.blue.withOpacity(0.2)),
                    ),
                    LineChartBarData(
                      spots: salesData.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.profit)).toList(),
                      isCurved: true,
                      color: Colors.green,
                      barWidth: 2,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: false),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecommendations(List<dynamic> recommendations) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('AI Strategic Priorities', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 12),
        ...recommendations.take(3).map((rec) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: BorderSide(color: Theme.of(context).dividerColor),
              ),
              child: Container(
                decoration: BoxDecoration(
                  border: Border(left: BorderSide(color: rec.type == 'Critical' ? Colors.red : Colors.blue, width: 4)),
                ),
                child: ListPadding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(rec.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                          Text('${rec.confidence}%', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(rec.recommendation, style: const TextStyle(fontSize: 13, color: Colors.black87)),
                    ],
                  ),
                ),
              ),
            )),
      ],
    );
  }

  void _handleAddRevenue() async {
    final amount = double.tryParse(_amountController.text);
    if (amount == null) return;

    final success = await context.read<MarketProvider>().addRevenue(amount, _selectedMonth);
    if (success) {
      _amountController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Revenue added successfully!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add revenue')),
      );
    }
  }

  void _showAddRevenueDialog(BuildContext context) {
    // Similar to handleAddRevenue but in a dialog for mobile UX
  }
}

class ListPadding extends StatelessWidget {
  final EdgeInsets padding;
  final Widget child;
  const ListPadding({super.key, required this.padding, required this.child});
  @override
  Widget build(BuildContext context) => Padding(padding: padding, child: child);
}
