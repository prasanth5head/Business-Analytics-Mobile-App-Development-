class MarketData {
  final List<SalesData> salesData;
  final List<ProductData> productData;
  final Summary summary;

  MarketData({
    required this.salesData,
    required this.productData,
    required this.summary,
  });

  factory MarketData.fromJson(Map<String, dynamic> json) {
    return MarketData(
      salesData: (json['salesData'] as List)
          .map((i) => SalesData.fromJson(i))
          .toList(),
      productData: (json['productData'] as List)
          .map((i) => ProductData.fromJson(i))
          .toList(),
      summary: Summary.fromJson(json['summary']),
    );
  }
}

class SalesData {
  final String month;
  final double sales;
  final double profit;

  SalesData({
    required this.month,
    required this.sales,
    required this.profit,
  });

  factory SalesData.fromJson(Map<String, dynamic> json) {
    return SalesData(
      month: json['p'] ?? '',
      sales: (json['sales'] as num).toDouble(),
      profit: (json['profit'] as num).toDouble(),
    );
  }
}

class ProductData {
  final String name;
  final double profitMargin;

  ProductData({
    required this.name,
    required this.profitMargin,
  });

  factory ProductData.fromJson(Map<String, dynamic> json) {
    return ProductData(
      name: json['name'] ?? '',
      profitMargin: (json['profitMargin'] as num).toDouble(),
    );
  }
}

class Summary {
  final double totalSales;
  final int activeUsers;
  final double avgProfit;
  final String growthRate;
  final String customerGrowth;
  final String profitGrowth;

  Summary({
    required this.totalSales,
    required this.activeUsers,
    required this.avgProfit,
    required this.growthRate,
    required this.customerGrowth,
    required this.profitGrowth,
  });

  factory Summary.fromJson(Map<String, dynamic> json) {
    return Summary(
      totalSales: (json['totalSales'] as num).toDouble(),
      activeUsers: json['activeUsers'] as int,
      avgProfit: (json['avgProfit'] as num).toDouble(),
      growthRate: json['growthRate'] ?? '0%',
      customerGrowth: json['customerGrowth'] ?? '0%',
      profitGrowth: json['profitGrowth'] ?? '0%',
    );
  }
}
