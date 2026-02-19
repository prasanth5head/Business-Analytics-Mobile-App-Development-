import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/market_data.dart';
import '../models/recommendation.dart';

class MarketProvider with ChangeNotifier {
  MarketData? _marketData;
  AiRecommendations? _aiRecommendations;
  bool _isLoading = false;
  String? _error;

  MarketData? get marketData => _marketData;
  AiRecommendations? get aiRecommendations => _aiRecommendations;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final String baseUrl = 'https://business-analytics-mobile-app-development.onrender.com/api';

  Future<void> fetchData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.get(Uri.parse('$baseUrl/market/data'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _marketData = MarketData.fromJson(data);

        // Get AI recommendations
        final aiResponse = await http.post(
          Uri.parse('$baseUrl/market/recommendations'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({
            'salesData': data['salesData'],
            'productData': data['productData'],
            'summary': data['summary'],
          }),
        );

        if (aiResponse.statusCode == 200) {
          _aiRecommendations = AiRecommendations.fromJson(json.decode(aiResponse.body));
        }
      } else {
        _error = 'Failed to fetch data: ${response.statusCode}';
      }
    } catch (e) {
      _error = 'Error: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addRevenue(double amount, String month) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/market/revenue'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'amount': amount, 'month': month}),
      );

      if (response.statusCode == 200) {
        await fetchData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
