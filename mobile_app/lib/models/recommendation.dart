class AiRecommendations {
  final List<Recommendation> recommendations;
  final String aiAnalysis;

  AiRecommendations({
    required this.recommendations,
    required this.aiAnalysis,
  });

  factory AiRecommendations.fromJson(Map<String, dynamic> json) {
    return AiRecommendations(
      recommendations: (json['recommendations'] as List)
          .map((i) => Recommendation.fromJson(i))
          .toList(),
      aiAnalysis: json['aiAnalysis'] ?? '',
    );
  }
}

class Recommendation {
  final String title;
  final String recommendation;
  final String type;
  final int confidence;

  Recommendation({
    required this.title,
    required this.recommendation,
    required this.type,
    required this.confidence,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      title: json['title'] ?? '',
      recommendation: json['recommendation'] ?? '',
      type: json['type'] ?? 'Normal',
      confidence: json['confidence'] as int? ?? 0,
    );
  }
}
