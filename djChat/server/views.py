from django.db.models import Count
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Server
from .schema import server_list_docs
from .serializer import CategorySerializer, ServerSerializer


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    # permission_classes = [
    #     IsAuthenticated,
    # ]

    @server_list_docs
    def list(self, request):
        """
        Handle GET requests to retrieve a list of Server objects.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The serialized Server objects as a REST framework Response.

        Query Parameters:
        - category (str): Filter servers by category name.
        - qty (int): Limit the number of results to the specified quantity.
        - by_user (bool): Filter servers by the current authenticated user (requires authentication).
        - by_serverid (int): Filter servers by the specified server ID.
        - with_num_members (bool): Annotate the queryset with the number of members.

        """

        # Extract query parameters from the request
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        # Apply filtering based on 'category'
        if category:
            self.queryset = self.queryset.filter(category__name=category)

        # Apply filtering based on 'by_user'
        if by_user:
            # Check authentication for 'by_user' query
            if by_user and not request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(member=user_id)
            raise AuthenticationFailed(detail="User Needs to be Logged In")

        # Annotate queryset with the number of members if 'with_num_members' is True
        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        # Apply limit on the number of results if 'qty' is specified
        if qty:
            self.queryset = self.queryset[: int(qty)]

        # Apply filtering based on 'by_serverid'
        if by_serverid:
            # if not request.user.is_authenticated:
            #     raise AuthenticationFailed()
            try:
                self.queryset = self.queryset.filter(id=by_serverid)
                # Raise ValidationError if the specified server ID does not exist
                if not self.queryset.exists():
                    raise ValidationError(
                        detail=f"Server with ID : {by_serverid} not found"
                    )

            except ValueError:
                raise ValidationError(detail="Server Value Error")

        # Serialize the queryset using ServerSerializer
        serializer = ServerSerializer(
            self.queryset, many=True, context={"num_members": with_num_members}
        )

        # Return the serialized data as a Response
        return Response(serializer.data)
